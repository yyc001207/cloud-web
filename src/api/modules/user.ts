import request from '../request'
import type {
  UserInfoResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from '../../types/api'

// 用户模块 API
export const userApi = {
  // 获取用户信息
  getUserInfo() {
    return request.post<UserInfoResponse>('/user/userInfo')
  },

  // 更新用户信息
  updateUserInfo(data: UserUpdateRequest) {
    return request.post<UserUpdateResponse>('/user/update', data)
  },
}
