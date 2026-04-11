import request from '../utils/request'
import type { LoginRequest, LoginResponse, LogoutRequest, UserInfoResponse } from '../types/auth'

export function login(data: LoginRequest) {
    return request.post<LoginResponse>('/api/user/login', data)
}

export function logout(data: LogoutRequest = {}) {
    return request.post('/api/user/logout', data)
}

export function getUserInfo() {
    return request.post<UserInfoResponse>('/api/user/userInfo')
}
