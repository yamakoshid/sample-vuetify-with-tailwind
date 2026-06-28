import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

/**
 * dayjsはシングルトンのため、一度設定すれば、グローバルに設定が反映される。
 * $dayjsとしても、dayjsとしてもどちらもsetDefaultが適用される。
 */
dayjs.extend(utc)
dayjs.extend(timezone)
// dayjs.tz.setDefault('Asia/Tokyo')
// dayjs.tz.setDefault('UTC')
dayjs.tz.setDefault('America/New_York')

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs,
    },
  }
})
