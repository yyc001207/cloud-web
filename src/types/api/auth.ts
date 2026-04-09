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

// 注册请求
export interface RegisterRequest {
  userName: string
  password: string
  isActive?: boolean
}

// 注册响应
export interface RegisterResponse {
  token: string
  user: UserInfo
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
