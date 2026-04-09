import request from '../request'
import type {
  WeatherRequest,
  WeatherResponse,
  Holiday,
  HolidayCreateRequest,
  HolidayListResponse,
} from '../../types/api'

// 代理服务模块 API
export const proxyApi = {
  // 天气服务
  weather: {
    // 获取天气
    get(data: WeatherRequest) {
      return request.post<WeatherResponse>('/proxy/weather', data)
    },
  },

  // 节假日服务
  holidays: {
    // 获取节假日列表
    list() {
      return request.post<HolidayListResponse>('/proxy/holidays')
    },

    // 创建节假日
    create(data: HolidayCreateRequest) {
      return request.post<Holiday>('/proxy/holiday/add', data)
    },

    // 删除节假日
    delete(id: number) {
      return request.post<void>('/proxy/holiday/delete', null, { params: { id } })
    },
  },
}
