import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api'
import type { UserInfo, LoginRequest } from '../types/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string>('')
  const user = ref<UserInfo | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  // 初始化时从 localStorage 恢复登录状态
  function initAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken) {
      token.value = storedToken
    }
    
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        user.value = null
      }
    }
  }

  // 登录
  async function login(data: LoginRequest) {
    const response = await authApi.login(data) as unknown as { token: string; user: UserInfo }

    // 保存 token 和用户信息
    token.value = response.token
    user.value = response.user

    // 持久化到 localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))

    return response
  }

  // 登出
  function logout() {
    // 清除状态
    token.value = ''
    user.value = null
    
    // 清除 localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 更新用户信息
  function updateUserInfo(userInfo: Partial<UserInfo>) {
    if (user.value) {
      user.value = { ...user.value, ...userInfo }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    // State
    token,
    user,
    isAuthenticated,
    // Actions
    initAuth,
    login,
    logout,
    updateUserInfo,
  }
})
