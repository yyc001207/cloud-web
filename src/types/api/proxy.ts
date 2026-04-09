// 天气请求
export interface WeatherRequest {
  city?: string
  latitude?: number
  longitude?: number
}

// 天气数据
export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
  weather: string
  description: string
  icon: string
  forecast: WeatherForecast[]
}

// 天气预报
export interface WeatherForecast {
  date: string
  temperature: {
    min: number
    max: number
  }
  weather: string
  icon: string
}

// 天气响应
export interface WeatherResponse {
  data: WeatherData
}

// 节假日
export interface Holiday {
  id: number
  name: string
  date: string
  type: 'holiday' | 'workday'
  description?: string
}

// 创建节假日请求
export interface HolidayCreateRequest {
  name: string
  date: string
  type: 'holiday' | 'workday'
  description?: string
}

// 删除节假日请求
export interface HolidayDeleteRequest {
  id: number
}

// 节假日列表响应
export interface HolidayListResponse {
  holidays: Holiday[]
}
