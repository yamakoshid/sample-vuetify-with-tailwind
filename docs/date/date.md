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
