import request from '../request'
import type {
  Menu,
  MenuCreateRequest,
  MenuUpdateRequest,
  MenuListResponse,
} from '../../types/api'

// 系统管理模块 API
export const systemApi = {
  // 菜单管理
  menus: {
    // 获取菜单列表
    list() {
      return request.post<MenuListResponse>('/system/menus')
    },

    // 创建菜单
    create(data: MenuCreateRequest) {
      return request.post<Menu>('/system/menu/add', data)
    },

    // 更新菜单
    update(data: MenuUpdateRequest) {
      return request.post<Menu>('/system/menu/update', data)
    },

    // 删除菜单
    delete(id: number) {
      return request.post<void>('/system/menu/delete', null, { params: { id } })
    },
  },
}
