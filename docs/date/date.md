# 日付

## やりたいこと

フロントエンドの日付判定をユーザーのブラウザによらず実施したい。

- バックエンドから、日付が文字列型で返る(ISO8601)
  - フォーマット
    - YYYY-MM-DD
  - 例
    - 2025-12-01
  - 日付は、JSTの日付になる。

- フロントエンドでは、現在時刻をとる。
  - 現在時刻の日付と、バックエンドの日付を比較する。
    - 現在時刻の日付をJSTの日付にする必要があるか?

## 鉄板は、次

1. バックエンドのJSTの日付をそのまま使う。
2. フロントエンドでは、Asia/Tokyoを指定して、日付をAsia/Tokyoの日付とする。
3. そのまま文字列比較する

```js
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'Asia/Tokyo'

// バックエンドから来る日付文字列 (YYYY-MM-DD)
const backendDate = '2025-12-01'

// 現在時刻をJSTの日付(YYYY-MM-DD)として取得
const todayInJST = dayjs().tz(TIMEZONE).format('YYYY-MM-DD')

// 比較
const isSameDay = todayInJST === backendDate
const isBeforeDay = todayInJST < backendDate // 文字列の辞書順比較でOK (YYYY-MM-DD形式)
const isAfterDay = todayInJST > backendDate
```

## dayjsを使う場合

1. バックエンドのJSTの日付を、JSTとしてdayjs型に変換
2. dayjsでタイムゾーンJSTに指定して、日付作る。
3. 比較する。

- dayjsの型と、Date型は異なる

  ```
  const d1 = new Date('2025-12-01');
  const d2 = dayjs('2025-12-01');

  d1 instanceof Date   // true
  d2 instanceof Date   // false

  typeof d1  // "object"
  typeof d2  // "object"
  ```

- .isBefore(), .isAfter(), .isSame()のメソッドがdayjsオブジェクトにある。

- date型をdayjs型にするまでしていいのか?

## Dateを使う?

この場合、ミリ秒まで比較になるので適さない。

```ts

// JSTを、Date型にする。
// 各ブラウザのTimezoneに変換
const backendDate = dayjs('2025-12-01').toDate()
// Date()でブラウザの現在時刻を取得
const now = new Date()

if (now < backendDate) {
  console.log('backendDate is future')
} else if (now === backendDate) {
  // これは参照比較なのでNG
  console.log('backendDate is now')
} else {
  console.log('backendDate is past')
}

const nowdays = dayjs().format('YYYY-MM-DD')
```

## 業務ルール

- 月度単位で、設定を変えられる
  - 4月度: 設定April
  - 5月度: 設定May

- 設定変更時は、次の情報をInputとする。
  - 開始日と設定値
    - 5月度から開始 : 2026-04-21 - 2026-05-20

      ```yaml
      start_date: '2026-04-21'
      value: '設定May'
      ```

      ```yaml
      start_date: '2026-05-01'
      value: '設定May'
      ```

    - 6月度から開始

      ```yaml
      start_date: '2026-05-21'
      value: '設定May'
      ```

  - 終了日

    ```yaml
    end_date: '2026-04-20'
    ```

- 月度は、20日締め。
  - 例
    - 4月度
      - 2026-03-21 to 2026-04-20
    - 5月度
      - 2026-4-21 to 2026-05-20

- 設定変更可能な期限
  - 当月の20日までは当月分の設定変更はできる。日付変更のタイミングは、JST(UTC+09:00)とする。
    - 例
      - 2026年4月度の設定変更
        - 設定変更ができる最終時刻
          - 2026-04-20T23:59:59+09:00
        - 設定変更ができない締め切り後の時刻
          - 2026-04-21T00:00:00+09:00
  - 未来の変更は可能

- 設定変更の単位は月ごととする。すなわち、日付を指定された場合、直近の月度の開始日から適用する。
  - 例
    - 現在の設定値
      - 2026-01-01 - 2026-01-20: 設定January
      - 2026-01-21 - 2026-02-20: 設定February
      - 2026-02-21 - 2026-03-20: 設定March
      - 2026-03-21 - 9999-12-20: 設定April
    - 現在の日付
      - 2026-04-01
        (4月度)

    - 状況1: 4月度の設定を、設定April-modifiedに変えてほしい
      - リクエスト

        ```yaml
        start_date: 2026-03-21
        value: '設定April-modified'
        ```

      - 完了時の値
        - 2026-01-01 - 2026-01-20: 設定January
        - 2026-01-21 - 2026-02-20: 設定February
        - 2026-02-21 - 2026-03-20: 設定March
        - 2026-03-21 - 9999-12-20: 設定April

    - 状況2: 4月1日から、設定April-modifiedに変えてほしい
      - Remark
        - UI上は月度単位で選択させる。
        - 日付単位では選択できないようにするので、このケースはない。
        - ただし、月度の中間の値の指定はシステム上できるので(日付まで送っているから)このケースの場合、4月度を変えるのが自然か、5月度を変えるのが自然化を考えておく。

      - リクエスト

        ```yaml
        start_date: 2026-04-01
        value: '設定April-modified'
        ```

        - 思考実験
          - Question. これは、4月度の変更として受けるのが自然?それとも、5月度の変更として受けるのが自然?
            - A. 4月1日は4月度の日付。そのため、4月度の変更と受け取り、3月21日(4月度)から設定する。
            - B. 4月1日以降の切り替えタイミングは4月21日(5月度)のため、4月21日(5月度)から設定する。
          - Ansewer. Aのほうがユーザー的には自然か?
            - ロジック的には次になる。
              1. 指定した日付の月度を判定する
              2. その月度の開始日に日付を読み替えて設定。

      - 完了時の値
        - 2026-01-01 - 2026-01-20: 設定January
        - 2026-01-21 - 2026-02-20: 設定February
        - 2026-02-21 - 2026-03-20: 設定March
        - 2026-03-21 - 9999-12-20: 設定April-modified

    - 状況3: 5月度から、設定Mayとしたい
      - リクエスト

        ```yaml
        start_date: 2026-04-21
        value: '設定May'
        ```

      - 完了時の値
        - 2026-01-01 - 2026-01-20: 設定January
        - 2026-01-21 - 2026-02-20: 設定February
        - 2026-02-21 - 2026-03-20: 設定March
        - 2026-03-21 - 2026-04-21: 設定April
        - 2026-04-21 - 9999-12-20: 設定May

    - 状況4: 3月度(過去)から、設定March-modifiedとしたい。
      - リクエスト

        ```yaml
        start_date: 2026-02-21
        value: '設定March-modified'
        ```

      - 完了時の値
        - 現在既に4月度であり、過去改変はできないのでエラー。

- もともとの範囲を超えた設定変更はできない。
  - 例
    - 次の場合に、5月度の設定はできない。
      - 2026-01-21 - 2026-02-20: 設定February
      - 2026-02-21 - 2026-03-20: 設定March
      - 2026-03-21 - 2026-04-21: 設定April

- 未来の設定値は、一つしか予約できない。2つ以上になる場合はエラー

## 関数

- public
  - 指定した日付が期限切れではないか確認する
  - 現在の日付において、指定可能な月度(未来12か月分)を取得する
    - 結果をセレクトリストにする

- 指定日から月度に変換する

- 現在の日付の月度を取得する
-
