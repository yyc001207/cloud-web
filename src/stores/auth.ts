import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi, getUserInfo as getUserInfoApi } from '../api/auth'
import type { LoginRequest, UserInfo } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string>(localStorage.getItem('token') || '')
    const userInfo = ref<UserInfo | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    async function login(data: LoginRequest) {
        const res = await loginApi(data)
        token.value = res.token
        localStorage.setItem('token', res.token)
    }

    async function logout() {
        try {
            await logoutApi()
        } catch {
        } finally {
            token.value = ''
            userInfo.value = null
            localStorage.removeItem('token')
        }
    }

    async function getUserInfo() {
        const res = await getUserInfoApi()
        userInfo.value = res.data
    }

    return {
        token,
        userInfo,
        isAuthenticated,
        login,
        logout,
        getUserInfo,
    }
})
