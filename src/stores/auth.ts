import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api'
import { userApi } from '../api'
import type { UserInfo, LoginRequest } from '../types/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string>('')
  const user = ref<UserInfo | null>(null)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isLoading = ref(false)

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

  // 从本地存储获取 token（不设置到 state）
  function getTokenFromStorage(): string | null {
    return localStorage.getItem('token')
  }

  // 设置 token 和用户信息
  function setAuth(userToken: string, userInfo: UserInfo) {
    token.value = userToken
    user.value = userInfo
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  // 登录
  async function login(data: LoginRequest) {
    const response = await authApi.login(data) as unknown as { token: string; user: UserInfo }

    // 保存 token 和用户信息
setAuth(response.token, response.user)

    return response
  }

  // 获取用户信息（用于验证 token 有效性）
  async function fetchUserInfo(): Promise<boolean> {
    try {
      isLoading.value = true
      const response = await userApi.getUserInfo() as unknown as { user: UserInfo }
      if (response.user) {
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
        return true
      }
      return false
    } catch (error: any) {
      // 401 或 403 表示 token 失效
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false
      }
      // 其他错误（网络问题等）也视为验证失败
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 服务端登出
  async function serverLogout(): Promise<boolean> {
    try {
      await authApi.logout()
      return true
    } catch (error) {
      // 即使服务端登出失败，也要继续清除本地状态
      return false
    }
  }

  // 清除本地认证状态
  function clearAuth() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 登出（完整流程：服务端登出 + 清除本地状态）
  async function logout() {
    await serverLogout()
    clearAuth()
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
    isLoading,
    // Actions
    initAuth,
    getTokenFromStorage,
    setAuth,
    login,
    fetchUserInfo,
    serverLogout,
    clearAuth,
    logout,
    updateUserInfo,
  }
})
