// 图标信息
export interface IconInfo {
  type: 'emoji' | 'icon' | 'url'
  value: string
}

// 标签
export interface Tab {
  id: number
  label: string
  desc?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

// 网站
export interface Website {
  id: number
  tabId: number
  label: string
  url: string
  desc?: string
  icon?: IconInfo
  github?: string
  document?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

// 创建标签请求
export interface TabCreateRequest {
  label: string
  desc?: string
  order?: number
}

// 更新标签请求
export interface TabUpdateRequest {
  id: number
  label?: string
  desc?: string
  order?: number
}

// 删除标签请求
export interface TabDeleteRequest {
  id: number
}

// 创建网站请求
export interface WebsiteCreateRequest {
  tabId: number
  label: string
  url: string
  desc?: string
  icon?: IconInfo
  github?: string
  document?: string
  order?: number
}

// 更新网站请求
export interface WebsiteUpdateRequest {
  id: number
  tabId?: number
  label?: string
  url?: string
  desc?: string
  icon?: IconInfo
  github?: string
  document?: string
  order?: number
}

// 删除网站请求
export interface WebsiteDeleteRequest {
  id: number
}

// 更新网站排序请求
export interface WebsiteOrderRequest {
  tabId: number
  websiteIds: number[]
}

// 网站列表请求
export interface WebsiteListRequest {
  tabId?: number
  label?: string
  pageNum?: number
  pageSize?: number
}

// 标签列表响应
export interface TabListResponse {
  tabs: Tab[]
}

// 网站列表响应
export interface WebsiteListResponse {
  websites: Website[]
  total: number
}
