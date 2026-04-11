import { Solar, Lunar } from 'lunar-javascript'

// 获取农历日期（如：初一、十五）
export function getLunarDay(date: Date): string {
  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()
  return lunar.getDayInChinese()
}

// 获取农历月份
export function getLunarMonth(date: Date): string {
  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()
  return lunar.getMonthInChinese() + '月'
}

// 获取节气
export function getSolarTerm(date: Date): string | null {
  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()
  const jieQi = lunar.getJieQi()
  return jieQi || null
}

// 获取节日（包括传统节日和公历节日）
export function getFestival(date: Date): string | null {
  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()

  // 获取农历节日
  const lunarFestivals = lunar.getFestivals()
  if (lunarFestivals.length > 0) {
    return lunarFestivals[0]
  }

  // 获取公历节日
  const solarFestivals = solar.getFestivals()
  if (solarFestivals.length > 0) {
    return solarFestivals[0]
  }

  return null
}

// 获取宜忌
export function getYiJi(date: Date): { yi: string[], ji: string[] } {
  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()

  return {
    yi: lunar.getDayYi(),
    ji: lunar.getDayJi()
  }
}

// 获取完整农历信息
export function getLunarInfo(date: Date) {
  return {
    day: getLunarDay(date),
    month: getLunarMonth(date),
    solarTerm: getSolarTerm(date),
    festival: getFestival(date),
    yiJi: getYiJi(date)
  }
}

// 节日定义
interface Festival {
  name: string
  month: number // 1-12
  day: number // 1-31
  isLunar: boolean
}

// 公历节日列表
const solarFestivals: Festival[] = [
  { name: '元旦', month: 1, day: 1, isLunar: false },
  { name: '情人节', month: 2, day: 14, isLunar: false },
  { name: '妇女节', month: 3, day: 8, isLunar: false },
  { name: '植树节', month: 3, day: 12, isLunar: false },
  { name: '劳动节', month: 5, day: 1, isLunar: false },
  { name: '青年节', month: 5, day: 4, isLunar: false },
  { name: '儿童节', month: 6, day: 1, isLunar: false },
  { name: '建党节', month: 7, day: 1, isLunar: false },
  { name: '建军节', month: 8, day: 1, isLunar: false },
  { name: '教师节', month: 9, day: 10, isLunar: false },
  { name: '国庆节', month: 10, day: 1, isLunar: false },
  { name: '平安夜', month: 12, day: 24, isLunar: false },
  { name: '圣诞节', month: 12, day: 25, isLunar: false },
]

// 农历节日列表（月份和日期都是农历）
const lunarFestivals: Festival[] = [
  { name: '春节', month: 1, day: 1, isLunar: true },
  { name: '元宵', month: 1, day: 15, isLunar: true },
  { name: '端午', month: 5, day: 5, isLunar: true },
  { name: '七夕', month: 7, day: 7, isLunar: true },
  { name: '中元', month: 7, day: 15, isLunar: true },
  { name: '中秋', month: 8, day: 15, isLunar: true },
  { name: '重阳', month: 9, day: 9, isLunar: true },
  { name: '腊八', month: 12, day: 8, isLunar: true },
  { name: '小年', month: 12, day: 23, isLunar: true },
  { name: '除夕', month: 12, day: 30, isLunar: true },
]

// 获取下一个节日
export function getNextFestival(fromDate: Date = new Date()): { name: string; date: Date } | null {
  const currentYear = fromDate.getFullYear()

  // 收集所有节日在本年和明年的日期
  const allFestivals: { name: string; date: Date }[] = []

  // 处理公历节日
  for (const festival of solarFestivals) {
    // 今年
    const thisYearDate = new Date(currentYear, festival.month - 1, festival.day)
    allFestivals.push({ name: festival.name, date: thisYearDate })

    // 明年
    const nextYearDate = new Date(currentYear + 1, festival.month - 1, festival.day)
    allFestivals.push({ name: festival.name, date: nextYearDate })
  }

  // 处理农历节日
  for (const festival of lunarFestivals) {
    try {
      // 今年
      let thisYearDay = festival.day
      // 特殊处理除夕：获取农历12月的实际天数
      if (festival.name === '除夕') {
        const lunarYear = Lunar.fromYmd(currentYear, 12, 1)
        thisYearDay = lunarYear.getDay()
      }
      const thisYearLunarDate = Lunar.fromYmd(currentYear, festival.month, thisYearDay)
      const thisYearSolar = thisYearLunarDate.getSolar()
      const thisYearDate = new Date(
        thisYearSolar.getYear(),
        thisYearSolar.getMonth() - 1,
        thisYearSolar.getDay()
      )
      allFestivals.push({ name: festival.name, date: thisYearDate })

      // 明年
      let nextYearDay = festival.day
      // 特殊处理除夕：获取农历12月的实际天数
      if (festival.name === '除夕') {
        const lunarYear = Lunar.fromYmd(currentYear + 1, 12, 1)
        nextYearDay = lunarYear.getDay()
      }
      const nextYearLunarDate = Lunar.fromYmd(currentYear + 1, festival.month, nextYearDay)
      const nextYearSolar = nextYearLunarDate.getSolar()
      const nextYearDate = new Date(
        nextYearSolar.getYear(),
        nextYearSolar.getMonth() - 1,
        nextYearSolar.getDay()
      )
      allFestivals.push({ name: festival.name, date: nextYearDate })
    } catch (error) {
      // 如果计算失败，跳过该节日
      console.warn(`Failed to calculate lunar festival: ${festival.name}`, error)
    }
  }

  // 过滤掉已经过去的节日，并按日期排序
  const upcomingFestivals = allFestivals
    .filter(f => f.date > fromDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  return upcomingFestivals.length > 0 ? upcomingFestivals[0] : null
}

// 计算距离某个日期的天数
export function getDaysUntil(targetDate: Date, fromDate: Date = new Date()): number {
  const diffTime = targetDate.getTime() - fromDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 获取下一个节日倒计时信息
export function getNextFestivalCountdown(fromDate: Date = new Date()): { name: string; days: number } | null {
  const nextFestival = getNextFestival(fromDate)
  if (!nextFestival) return null

  const days = getDaysUntil(nextFestival.date, fromDate)
  return {
    name: nextFestival.name,
    days
  }
}

export type DateClassification = 'holiday' | 'adjustment' | 'regular'

function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isValidDateFormat(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateStr)) return false
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

export function classifyDate(
  date: Date,
  holidayDates: string[] = [],
  adjustmentDates: string[] = [],
): DateClassification {
  const dateKey = formatDateKey(date)

  const validHolidays = holidayDates.filter(isValidDateFormat)
  const validAdjustments = adjustmentDates.filter(isValidDateFormat)

  if (validHolidays.includes(dateKey)) {
    return 'holiday'
  }

  if (validAdjustments.includes(dateKey)) {
    return 'adjustment'
  }

  return 'regular'
}
