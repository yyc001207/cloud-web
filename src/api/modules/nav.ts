import request from '../request'
import type {
  Tab,
  TabCreateRequest,
  TabUpdateRequest,
  Website,
  WebsiteCreateRequest,
  WebsiteUpdateRequest,
  WebsiteOrderRequest,
  WebsiteListRequest,
  TabListResponse,
  WebsiteListResponse,
} from '../../types/api'

// 导航管理模块 API
export const navApi = {
  // 标签管理
  tabs: {
    // 获取标签列表
    list() {
      return request.post<TabListResponse>('/nav/tabs')
    },

    // 创建标签
    create(data: TabCreateRequest) {
      return request.post<Tab>('/nav/tab/add', data)
    },

    // 更新标签
    update(data: TabUpdateRequest) {
      return request.post<Tab>('/nav/tab/update', data)
    },

    // 删除标签
    delete(id: number) {
      return request.post<void>('/nav/tab/delete', null, { params: { id } })
    },
  },

  // 网站管理
  websites: {
    // 获取网站列表
    list(data: WebsiteListRequest) {
      return request.post<WebsiteListResponse>('/nav/websites', data)
    },

    // 创建网站
    create(data: WebsiteCreateRequest) {
      return request.post<Website>('/nav/website/add', data)
    },

    // 更新网站
    update(data: WebsiteUpdateRequest) {
      return request.post<Website>('/nav/website/update', data)
    },

    // 删除网站
    delete(id: number) {
      return request.post<void>('/nav/website/delete', null, { params: { id } })
    },

    // 更新网站排序
    updateOrder(data: WebsiteOrderRequest) {
      return request.post<void>('/nav/website/order', data)
    },
  },
}
