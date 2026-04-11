import request from '../utils/request'
import type { HolidayCreateRequest, HolidayListResponse, HolidayActionResponse } from '../types/holiday'

export function getHolidayList(data?: Record<string, unknown>) {
    return request.post<HolidayListResponse>('/api/proxy/holidays', data)
}

export function addHoliday(data: HolidayCreateRequest) {
    return request.post<HolidayActionResponse>('/api/proxy/holiday/add', data)
}

export function deleteHoliday(id: number) {
    return request.post<HolidayActionResponse>(`/api/proxy/holiday/delete?id=${id}`)
}
