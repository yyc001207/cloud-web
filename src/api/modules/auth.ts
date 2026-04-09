import request from '../request'
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
} from '../../types/api'

// 认证模块 API
export const authApi = {
  // 登录
  login(data: LoginRequest) {
    return request.post<LoginResponse>('/user/login', data)
  },

  // 登出
  logout(data?: LogoutRequest) {
    return request.post<LogoutResponse>('/user/logout', data || {})
  },
}
