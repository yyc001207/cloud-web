// 菜单
export interface Menu {
  id: number
  parentId?: number
  name: string
  path?: string
  icon?: string
  order?: number
  isShow?: boolean
  children?: Menu[]
  createdAt?: string
  updatedAt?: string
}

// 创建菜单请求
export interface MenuCreateRequest {
  parentId?: number
  name: string
  path?: string
  icon?: string
  order?: number
  isShow?: boolean
}

// 更新菜单请求
export interface MenuUpdateRequest {
  id: number
  parentId?: number
  name?: string
  path?: string
  icon?: string
  order?: number
  isShow?: boolean
}

// 删除菜单请求
export interface MenuDeleteRequest {
  id: number
}

// 菜单列表响应
export interface MenuListResponse {
  menus: Menu[]
}
