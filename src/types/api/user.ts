import type { UserInfo } from './auth'

// 更新用户信息请求
export interface UserUpdateRequest {
  userName?: string
  password?: string
  isActive?: boolean
}

// 更新用户信息响应
export interface UserUpdateResponse {
  user: UserInfo
}

// 获取用户信息响应
export interface UserInfoResponse {
  user: UserInfo
}

export type { UserInfo }
