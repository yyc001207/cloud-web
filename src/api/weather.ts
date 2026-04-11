import request from '../utils/request'
import type { WeatherRequest, WeatherResponse } from '../types/weather'

export function getWeather(data: WeatherRequest) {
    return request.post<WeatherResponse>('/api/proxy/weather', data)
}
