import type { RouteRecordRaw } from 'vue-router'

const viewModules = import.meta.glob('../views/admin/*.vue') as Record<string, () => Promise<any>>

export interface AdminRouteConfig {
  path: string
  name: string
  meta: {
    title: string
    icon: string
  }
  componentPath: string
}

export const adminRoutes: AdminRouteConfig[] = [
  {
    path: 'tab',
    name: 'Tab',
    meta: {
      title: '标签页管理',
      icon: 'tab'
    },
    componentPath: '../views/admin/TabView.vue'
  },
  {
    path: 'website',
    name: 'Website',
    meta: {
      title: '网站管理',
      icon: 'language'
    },
    componentPath: '../views/admin/WebsiteView.vue'
  },
  {
    path: 'holiday',
    name: 'Holiday',
    meta: {
      title: '节假日管理',
      icon: 'event'
    },
    componentPath: '../views/admin/HolidayView.vue'
  },
  {
    path: 'openlist',
    name: 'OpenList',
    meta: {
      title: 'openList管理',
      icon: 'list'
    },
    componentPath: '../views/admin/OpenListView.vue'
  },
  {
    path: 'transfer',
    name: 'Transfer',
    meta: {
      title: '中转站',
      icon: 'swap_horiz'
    },
    componentPath: '../views/admin/TransferView.vue'
  }
]

export const getAdminRouteRecords = (): RouteRecordRaw[] => {
  return adminRoutes.map(route => ({
    path: route.path,
    name: route.name,
    component: viewModules[route.componentPath],
    meta: route.meta
  }))
}

export const getMenuItems = () => {
  return adminRoutes.map(route => ({
    path: `/admin/${route.path}`,
    name: route.meta.title,
    icon: route.meta.icon
  }))
}
