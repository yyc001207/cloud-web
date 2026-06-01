import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getAdminRouteRecords } from '../utils/routeConfig'
import request from '../utils/request'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/admin',
    component: () => import('../components/AdminLayout.vue'),
    redirect: '/admin/tab',
    children: getAdminRouteRecords()
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth === false) {
    if (authStore.isAuthenticated) {
      next('/home')
    } else {
      try {
        await request.get('/api/verify/token', { _skipAuthRedirect: true } as any)
        authStore.isAuthenticated = true
        next('/home')
      } catch {
        next()
      }
    }
    return
  }

  if (authStore.isAuthenticated && authStore.userInfo) {
    next()
    return
  }

  try {
    if (!authStore.userInfo) {
      await authStore.getUserInfo()
    }
    next()
  } catch {
    authStore.isAuthenticated = false
    next({ path: '/login', query: { redirect: to.fullPath } })
  }
})

export default router
