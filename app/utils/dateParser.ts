import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

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
