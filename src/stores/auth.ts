import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi, getUserInfo as getUserInfoApi } from '../api/auth'
import type { LoginRequest, UserInfo } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
    const userInfo = ref<UserInfo | null>(null)
    const isAuthenticated = ref(false)

    async function login(data: LoginRequest) {
        await loginApi(data)
        isAuthenticated.value = true
    }

    async function logout() {
        try {
            await logoutApi()
        } catch {
        } finally {
            userInfo.value = null
            isAuthenticated.value = false
        }
    }

    async function getUserInfo() {
        const res = await getUserInfoApi()
        userInfo.value = res.data
        isAuthenticated.value = true
    }

    return {
        userInfo,
        isAuthenticated,
        login,
        logout,
        getUserInfo,
    }
})
