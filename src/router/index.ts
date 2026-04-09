import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    // 系统管理页面
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/admin/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/admin/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/menus',
      name: 'admin-menus',
      component: () => import('../views/admin/MenuView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('../views/admin/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// 标记是否正在处理认证验证
let isValidating = false

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // 初始化认证状态
  authStore.initAuth()

  // 已登录用户访问登录页，重定向到首页
  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  // 公开页面直接放行
  if (to.meta.public) {
    next()
    return
  }

  // 需要认证的页面
  if (to.meta.requiresAuth) {
    // 从本地存储获取 token
    const token = authStore.getTokenFromStorage()

    // Token 不存在，重定向到登录页
    if (!token) {
      ElMessage.warning('请先登录')
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    // 如果已经有用户信息，直接放行
    if (authStore.user) {
      next()
      return
    }

    // 避免重复验证
    if (isValidating) {
      next()
      return
    }

    isValidating = true

    try {
      // 调用 API 验证 token 有效性（获取用户信息）
      const isValid = await authStore.fetchUserInfo()

      if (isValid) {
        // Token 有效，允许访问
        next()
      } else {
        // Token 失效，执行完整登出流程
        await handleTokenInvalid(authStore, to, next)
      }
    } catch (error) {
      // 验证过程出错，执行完整登出流程
      await handleTokenInvalid(authStore, to, next)
    } finally {
      isValidating = false
    }
    return
  }

  // 其他页面直接放行
  next()
})

// 处理 Token 失效的完整流程
async function handleTokenInvalid(
  authStore: ReturnType<typeof useAuthStore>,
  to: any,
  next: any
) {
  try {
    // 1. 调用服务端登出接口
    await authStore.serverLogout()
  } catch (error) {
    // 服务端登出失败，继续执行本地清理
    console.error('服务端登出失败:', error)
  }

  // 2. 清除本地认证状态
  authStore.clearAuth()

  // 3. 提示用户
  ElMessage.warning('登录已过期，请重新登录')

  // 4. 重定向到登录页
  next({ name: 'login', query: { redirect: to.fullPath } })
}

export default router
