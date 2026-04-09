import request from '../request'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../types/api'

// 认证模块 API
export const authApi = {
  // 登录
  login(data: LoginRequest) {
    return request.post<LoginResponse>('/user/login', data)
  },

  // 注册
  register(data: RegisterRequest) {
    return request.post<RegisterResponse>('/user/register', data)
  },
}
