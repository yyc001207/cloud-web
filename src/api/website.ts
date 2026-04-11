import request from '../utils/request'
import type { WebsiteListRequest, WebsiteCreateRequest, WebsiteUpdateRequest, WebsiteOrderRequest, WebsiteListResponse, WebsiteActionResponse } from '../types/website'

export function getWebsiteList(data?: WebsiteListRequest) {
    return request.post<WebsiteListResponse>('/api/nav/websites', data)
}

export function addWebsite(data: WebsiteCreateRequest) {
    return request.post<WebsiteActionResponse>('/api/nav/website/add', data)
}

export function updateWebsite(data: WebsiteUpdateRequest) {
    return request.post<WebsiteActionResponse>('/api/nav/website/update', data)
}

export function deleteWebsite(id: number) {
    return request.post<WebsiteActionResponse>(`/api/nav/website/delete?id=${id}`)
}

export function updateWebsiteOrder(data: WebsiteOrderRequest) {
    return request.post<WebsiteActionResponse>('/api/nav/website/order', data)
}
