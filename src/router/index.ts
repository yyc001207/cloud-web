import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getAdminRouteRecords } from '../utils/routeConfig'

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
  const hasToken = !!localStorage.getItem('token')

  if (to.meta.requiresAuth === false) {
    if (hasToken) {
      next('/home')
    } else {
      next()
    }
    return
  }

  if (!hasToken) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (!authStore.userInfo) {
    try {
      await authStore.getUserInfo()
    } catch {
      authStore.token = ''
      localStorage.removeItem('token')
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }
  }

  next()
})

export default router
