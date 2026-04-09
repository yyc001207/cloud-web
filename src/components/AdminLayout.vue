<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './AppHeader.vue'

const route = useRoute()
const router = useRouter()

// 菜单数据
const menuItems = [
  {
    id: 'dashboard',
    label: '概览',
    icon: 'dashboard',
    path: '/admin/dashboard'
  },
  {
    id: 'users',
    label: '用户管理',
    icon: 'group',
    path: '/admin/users'
  },
  {
    id: 'menus',
    label: '菜单管理',
    icon: 'menu',
    path: '/admin/menus'
  },
  {
    id: 'settings',
    label: '系统设置',
    icon: 'settings',
    path: '/admin/settings'
  }
]

// 面包屑数据
const breadcrumbs = computed(() => {
  const crumbs = [{ label: '首页', path: '/home' }]
  
  const currentMenu = menuItems.find(item => item.path === route.path)
  if (currentMenu) {
    crumbs.push({ label: '系统管理', path: '/admin/dashboard' })
    crumbs.push({ label: currentMenu.label, path: currentMenu.path })
  } else if (route.path.startsWith('/admin')) {
    crumbs.push({ label: '系统管理', path: '/admin/dashboard' })
  }
  
  return crumbs
})

// 当前激活的菜单
const activeMenu = computed(() => {
  const current = menuItems.find(item => item.path === route.path)
  return current?.id || 'dashboard'
})

// 跳转到菜单
function navigateToMenu(path: string) {
  router.push(path)
}

// 跳转到面包屑
function navigateToBreadcrumb(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="admin-layout">
    <!-- 顶部导航 - 与首页相同 -->
    <AppHeader />

    <div class="admin-container">
      <!-- 左侧菜单 -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <span class="material-symbols-outlined">admin_panel_settings</span>
          <span class="sidebar-title">系统管理</span>
        </div>
        
        <nav class="sidebar-menu">
          <div
            v-for="item in menuItems"
            :key="item.id"
            :class="['menu-item', { active: activeMenu === item.id }]"
            @click="navigateToMenu(item.path)"
          >
            <span class="material-symbols-outlined menu-icon">{{ item.icon }}</span>
            <span class="menu-label">{{ item.label }}</span>
          </div>
        </nav>
      </aside>

      <!-- 右侧内容区 -->
      <main class="admin-main">
        <!-- 面包屑 -->
        <div class="breadcrumb">
          <span
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            class="breadcrumb-item"
          >
            <span
              :class="['crumb-text', { clickable: index < breadcrumbs.length - 1 }]"
              @click="index < breadcrumbs.length - 1 && navigateToBreadcrumb(crumb.path)"
            >
              {{ crumb.label }}
            </span>
            <span v-if="index < breadcrumbs.length - 1" class="crumb-separator">
              <span class="material-symbols-outlined">chevron_right</span>
            </span>
          </span>
        </div>

        <!-- 页面内容 -->
        <div class="admin-content">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  background: var(--surface);
}

.admin-container {
  display: flex;
  padding-top: 80px;
  min-height: 100vh;
}

// 左侧菜单
.admin-sidebar {
  width: 240px;
  background: var(--surface-container-low);
  border-right: 1px solid rgba(61, 74, 62, 0.1);
  padding: 24px 16px;
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(61, 74, 62, 0.1);

  .material-symbols-outlined {
    font-size: 24px;
    color: var(--primary);
  }
}

.sidebar-title {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--on-surface);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--on-surface-variant);

  &:hover {
    background: rgba(111, 230, 146, 0.1);
    color: var(--primary);
  }

  &.active {
    background: var(--primary);
    color: var(--on-primary);
    font-weight: 600;
  }
}

.menu-icon {
  font-size: 20px;
}

.menu-label {
  font-size: 0.875rem;
}

// 右侧内容区
.admin-main {
  flex: 1;
  margin-left: 240px;
  padding: 24px 32px;
}

// 面包屑
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: var(--surface-container-low);
  border-radius: 10px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.crumb-text {
  font-size: 0.875rem;
  color: var(--on-surface-variant);

  &.clickable {
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary);
    }
  }

  &:not(.clickable) {
    color: var(--on-surface);
    font-weight: 600;
  }
}

.crumb-separator {
  display: flex;
  align-items: center;
  color: var(--on-surface-variant);
  opacity: 0.5;

  .material-symbols-outlined {
    font-size: 16px;
  }
}

// 页面内容
.admin-content {
  background: var(--surface-container-low);
  border-radius: 16px;
  padding: 24px;
  min-height: calc(100vh - 200px);
}

// 响应式
@media (max-width: 768px) {
  .admin-container {
    padding-top: 64px;
  }

  .admin-sidebar {
    width: 100%;
    position: relative;
    top: 0;
    padding: 16px;
  }

  .admin-main {
    margin-left: 0;
    padding: 16px;
  }

  .admin-container {
    flex-direction: column;
  }
}
</style>
