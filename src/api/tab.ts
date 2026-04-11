import request from '../utils/request'
import type { TabListRequest, TabCreateRequest, TabUpdateRequest, TabListResponse, TabActionResponse } from '../types/tab'

export function getTabList(data?: TabListRequest) {
    return request.post<TabListResponse>('/api/nav/tabs', data)
}

export function addTab(data: TabCreateRequest) {
    return request.post<TabActionResponse>('/api/nav/tab/add', data)
}

export function updateTab(data: TabUpdateRequest) {
    return request.post<TabActionResponse>('/api/nav/tab/update', data)
}

export function deleteTab(id: number) {
    return request.post<TabActionResponse>(`/api/nav/tab/delete?id=${id}`)
}
