declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar
    static fromYmd(year: number, month: number, day: number): Solar
    getLunar(): Lunar
    getFestivals(): string[]
    getYear(): number
    getMonth(): number
    getDay(): number
  }

  export class Lunar {
    static fromDate(date: Date): Lunar
    static fromYmd(year: number, month: number, day: number): Lunar
    getDayInChinese(): string
    getMonthInChinese(): string
    getJieQi(): string | null
    getFestivals(): string[]
    getDayYi(): string[]
    getDayJi(): string[]
    getSolar(): Solar
    getDay(): number
  }
}
