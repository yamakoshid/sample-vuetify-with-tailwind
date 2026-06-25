import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { describe, expect, test } from 'vitest'

describe('sample test', () => {
  test('should pass', () => {
    expect(true).toBe(true)
  })

  //   test('should fail', () => {
  //     expect(true).toBe(false)
  //   })

  test('dayjs should work', () => {
    const date = dayjs('2024-01-01')
    expect(date.format('YYYY-MM-DD')).toBe('2024-01-01')
    console.log('Current date:', date.format('YYYY-MM-DD'))
  })
})
