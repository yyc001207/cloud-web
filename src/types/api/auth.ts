// 登录请求
export interface LoginRequest {
  userName: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  user: UserInfo
}

// 登出请求
export interface LogoutRequest {
  [key: string]: any
}

// 登出响应
export interface LogoutResponse {
  code: number
  message: string
  data: any
}

// 用户信息
export interface UserInfo {
  id: number
  userName: string
  avatar?: string
  email?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}
