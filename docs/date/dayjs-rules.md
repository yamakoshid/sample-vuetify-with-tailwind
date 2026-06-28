# 日付取り扱いルール

dayjs + Vuetify 3 + JST基準（20日締め）プロジェクト向け

---

## セットアップ

```js
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const JST = 'Asia/Tokyo' // タイムゾーン定数はここで一元管理
```

---

## 1. dayjsオブジェクトの作り方

### 現在時刻

```js
// ブラウザのタイムゾーンに関係なく常にJSTの現在時刻
dayjs().tz(JST)
```

### 文字列（オフセットなし）

サーバーから受け取った `"YYYY-MM-DD"` や `"YYYY-MM-DDTHH:mm:ss"`

```js
// 「この文字列はJST」と明示してパース
dayjs.tz('2025-04-15', JST)
dayjs.tz('2025-04-15T09:00:00', JST)
```

> オフセット情報がないため、どのタイムゾーンの値かを明示する必要がある

### 文字列（オフセット付き）

`"Z"` や `"+10:00"` などオフセットを含む文字列

```js
// オフセット情報があるのでそのまま作成できる
dayjs('2025-04-15T15:00:00Z') // UTC
dayjs('2025-04-15T03:00:00+10:00') // UTC+10
```

> オフセット情報が含まれているため、タイムゾーン指定は不要

### Date型（API由来）

UTC値が正しいDate型（APIレスポンスをDate型に変換済みの場合）

```js
// UTC内部値 → JSTに変換
dayjs(date).tz(JST)
```

### Date型（v-date-picker）

v-date-pickerはローカルタイムの `00:00:00` が付く → **入口で即変換する**

```js
// ① Date型をローカルタイムの数値で文字列に変換
//    ※ toISOString() は使わない（UTC変換でズレる）
function pickerToDateString(dateObj) {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}` // → "2025-04-15"
}

// ② 文字列からdayjsオブジェクトへ（オフセットなし文字列と同じ）
dayjs.tz(pickerToDateString(dateObj), JST)
```

> `pickerToDateString()` でDate型の責務を玄関で終わらせる。以降はオフセットなし文字列と同じ扱い

### まとめ一覧

| 入力                     | 作り方                                    |
| ------------------------ | ----------------------------------------- |
| 現在時刻                 | `dayjs().tz(JST)`                         |
| 文字列（オフセットなし） | `dayjs.tz(value, JST)`                    |
| 文字列（オフセット付き） | `dayjs(value)`                            |
| Date型（API由来）        | `dayjs(date).tz(JST)`                     |
| Date型（v-date-picker）  | `dayjs.tz(pickerToDateString(date), JST)` |

---

## 2 比較・計算

比較前は必ず `.startOf('day')` で時刻を揃える

```js
const today = dayjs().tz(JST).startOf('day')
const deadline = dayjs.tz(response.deadline, JST).startOf('day')

today.isBefore(deadline) // → 締切前
today.isSame(deadline, 'day') // → 当日
today.isAfter(deadline) // → 締切超過
deadline.diff(today, 'day') // → 残り日数
```

> **当日の扱い：** `isSame` が `true` のとき「期限内か否か」はビジネスロジックとして別途定義する

---

## 3 format（出力）ルール

**大原則：formatの前は必ず `.tz(JST)` か `.local()` を指定する**

| 目的                          | コード                                    | 出力例                        |
| ----------------------------- | ----------------------------------------- | ----------------------------- |
| サーバー送信（日付のみ）      | `.tz(JST).format('YYYY-MM-DD')`           | `"2025-04-15"`                |
| サーバー送信（時刻あり・JST） | `.tz(JST).format('YYYY-MM-DDTHH:mm:ssZ')` | `"2025-04-15T09:00:00+09:00"` |
| サーバー送信（時刻あり・UTC） | `.utc().format()`                         | `"2025-04-15T00:00:00Z"`      |
| 画面表示（JST固定）           | `.tz(JST).format('YYYY年M月D日')`         | `"2025年4月15日"`             |
| 画面表示（ローカルタイム）    | `.local().format('YYYY年M月D日')`         | 端末のタイムゾーンで表示      |

> **補足：** `format('...Z')` の `Z` はオフセットを出力するフォーマット指定子（`+09:00` に展開される）。`toISOString()` の `Z`（UTC固定文字）とは別物。

---

## 4 やってはいけないこと

```js
// ❌ new Date('YYYY-MM-DD') → UTCとして解釈され日付がズレる
new Date('2025-04-15')

// ❌ タイムゾーン指定なしのdayjs → 環境依存になる
dayjs('2025-04-15')

// ❌ toISOString() → UTC変換で日付がズレる
date.toISOString()

// ❌ v-date-pickerのDate型にkeepLocalTimeを使う → 他と統一できない
dayjs(dateObj).tz(JST, true)

// ❌ Date型同士の生比較 → タイムゾーン非考慮
dateA > dateB

// ❌ formatの前にtzを指定しない → 環境依存になる
dayjsObj.format('YYYY-MM-DD')
```

---

## 全体フロー

```
【入口】
v-date-picker（Date型）
  → pickerToDateString()
  → dayjs.tz(value, JST)   ┐
                            │
サーバー受信（YYYY-MM-DD）  │
  → dayjs.tz(value, JST)   ├─ アプリ内は常に dayjs.tz(*, JST) に統一
                            │
現在時刻                    │
  → dayjs().tz(JST)        ┘

【アプリ内】
dayjs.tz(*, JST)
  → .startOf('day') で揃えてから比較・計算

【出口】
  → .tz(JST).format('YYYY-MM-DD')      サーバー送信（日付のみ）
  → .tz(JST).format('YYYY年M月D日')    画面表示（JST固定）
  → .local().format('YYYY年M月D日')    画面表示（ローカルタイム）
```
