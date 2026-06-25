import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// dayjsのtimezoneプラグインを使うと、任意のタイムゾーンで日付を扱える。
// dayjsのtimezoneプラグインは1回extendすると全体に影響する。dayjsがシングルトンのため。
dayjs.extend(utc)
dayjs.extend(timezone)

describe('date test', () => {
  beforeEach(() => {
    // vi.stubEnv('TZ', 'Asia/Tokyo')
  })

  afterEach(() => {
    // vi.unstubAllEnvs()
  })

  test('vi.useFakeTimersで固定した日時でテストできる', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
    expect(Date.now()).toBe(new Date('2024-01-01T00:00:00Z').getTime())
    vi.useRealTimers()
  })

  describe('new Dateに対して日付を与える場合と日時を与える場合は挙動が異なる', () => {
    test('AsiaTokyoの場合', () => {
      vi.stubEnv('TZ', 'Asia/Tokyo')

      // 日付のみの文字列を渡すと、UTC0:00として解釈される。
      const date = new Date('2024-01-01')

      const expectedWithTimezone = new Date('2024-01-01T00:00:00Z')
      const expectedWithTimezoneJST = new Date('2024-01-01T09:00:00+09:00')

      // 時刻があるがタイムゾーンが無い場合は、ブラウザのタイムゾーンで解釈される。
      const expectedWithoutTimezone = new Date('2024-01-01T09:00:00')
      expect(date).toEqual(expectedWithTimezone)
      expect(date).toEqual(expectedWithTimezoneJST)
      expect(date).toEqual(expectedWithoutTimezone)

      vi.unstubAllEnvs()
    })

    test('UTCの場合', () => {
      vi.stubEnv('TZ', 'UTC')

      // 時刻なしの場合は、UTC0:00として解釈される。
      const date = new Date('2024-01-01')

      const expectedWithTimezone = new Date('2024-01-01T00:00:00Z')
      const expectedWithTimezoneJST = new Date('2024-01-01T09:00:00+09:00')

      // 時刻があり、タイムゾーンが無い場合は、ブラウザのタイムゾーンで解釈される。
      const expectedWithoutTimezone = new Date('2024-01-01T00:00:00')
      expect(date).toEqual(expectedWithTimezone)
      expect(date).toEqual(expectedWithTimezoneJST)
      expect(date).toEqual(expectedWithoutTimezone)

      vi.unstubAllEnvs()
    })
  })

  describe('dayjs日付 UTC版', () => {
    beforeEach(() => {
      vi.stubEnv('TZ', 'UTC')
    })

    afterEach(() => {
      vi.unstubAllEnvs()
    })

    test('そのタイムゾーンの0時になる', () => {
      const date = dayjs('2024-01-01').toDate()
      expect(date).toEqual(new Date('2024-01-01T00:00:00Z'))
      expect(date).not.toEqual(new Date('2024-01-01T00:00:00+09:00'))
    })

    test('timezoneを指定すると、ブラウザのタイムゾーンによらず一意に定まる', () => {
      const date = dayjs.tz('2024-01-01', 'Asia/Tokyo').toDate()
      expect(date).toEqual(new Date('2024-01-01T00:00:00+09:00'))
    })
  })

  describe('dayjs日付 Asia/Tokyo版', () => {
    beforeEach(() => {
      vi.stubEnv('TZ', 'Asia/Tokyo')
    })

    afterEach(() => {
      vi.unstubAllEnvs()
    })

    test('そのタイムゾーンの0時になる', () => {
      const date = dayjs('2024-01-01').toDate()
      expect(date).toEqual(new Date('2024-01-01T00:00:00+09:00'))
      expect(date).not.toEqual(new Date('2024-01-01T00:00:00Z'))
    })

    test('timezoneを指定すると、ブラウザのタイムゾーンによらず一意に定まる', () => {
      dayjs.extend(utc)
      dayjs.extend(timezone)
      const date = dayjs.tz('2024-01-01', 'Asia/Tokyo').toDate()

      expect(date).toEqual(new Date('2024-01-01T00:00:00+09:00'))
    })
  })

  test('日付の比較ができる', () => {
    const date1 = new Date('2024-01-01')
    const date2 = new Date('2024-01-02')

    console.log('date1:', date1)

    expect(date1 < date2).toBe(true)
    expect(date1 > date2).toBe(false)
    expect(date1.getTime()).toBeLessThan(date2.getTime())
  })

  test('JSTで日付が変わるタイミング', () => {
    dayjs.extend(timezone)
    dayjs.extend(utc)

    // UTC 2025-12-01 14:59:59 は、JST 2025-12-01 23:59:59
    vi.setSystemTime(new Date('2025-12-01T14:59:59Z'))
    const todayInUtc1459 = dayjs().tz('UTC').format('YYYY-MM-DD')
    expect(todayInUtc1459).toBe('2025-12-01')
    const todayInJST1459 = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')
    expect(todayInJST1459).toBe('2025-12-01')

    vi.setSystemTime(new Date('2025-12-01T15:00:00Z'))
    const todayInUtc = dayjs().tz('UTC').format('YYYY-MM-DD')
    expect(todayInUtc).toBe('2025-12-01')
    const todayInJST = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')
    expect(todayInJST).toBe('2025-12-02')
  })

  test('JST', () => {
    // ブラウザのタイムゾーンの取得
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)

    console.log(new Date())
    console.log(dayjs())

    // DayJSは、現在のタイムゾーンの00:00としてDateオブジェクトを作る。
    // UTCだと、9h前の11/30 15:00のDate オブジェクトになる。
    const date1201 = dayjs('2025-12-01').toDate()
    console.log(date1201)
    const now = dayjs().format('YYYY-MM-DD')
    console.log(now)
  })

  test('compare', () => {
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
  })
})
