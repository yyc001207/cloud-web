<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import HeaderCore from './header/HeaderCore.vue'
import { getMenuItems } from '../utils/routeConfig'

const route = useRoute()
const router = useRouter()

// 菜单配置
const menuItems = getMenuItems()

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="admin-layout">
    <!-- 顶部栏 - 使用共享组件 -->
    <HeaderCore />

    <!-- 主体区域 -->
    <div class="admin-body">
      <!-- 左侧菜单 -->
      <aside class="admin-sidebar">
        <nav class="admin-menu">
          <div
            v-for="item in menuItems"
            :key="item.path"
            :class="['menu-item', { active: route.path === item.path }]"
            @click="navigateTo(item.path)"
          >
            <span class="material-symbols-outlined menu-icon">{{
              item.icon
            }}</span>
            <span class="menu-text">{{ item.name }}</span>
          </div>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="admin-main">
        <!-- 页面内容 -->
        <div class="admin-content">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
  overflow: hidden;
  background: var(--surface);
}

.admin-body {
  display: flex;
  padding-top: 80px;
  height: 100vh;
}

// 左侧菜单
.admin-sidebar {
  width: 220px;
  background: var(--surface-container-low);
  border-right: 1px solid rgba(61, 74, 62, 0.1);
  padding: 16px 0;
  position: fixed;
  top: 80px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
}

.admin-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--on-surface-variant);

  &:hover {
    background: var(--surface-container);
    color: var(--on-surface);
  }

  &.active {
    background: rgba(111, 230, 146, 0.15);
    color: var(--primary);
    font-weight: 600;
  }
}

.menu-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.menu-text {
  font-size: 0.875rem;
}

.admin-main {
  flex: 1;
  margin-left: 220px;
  padding: 24px 32px;
  height: calc(100vh - 80px);
  overflow: hidden;
}

.admin-content {
  background: var(--surface-container-low);
  border-radius: 12px;
  padding: 24px;
  height: calc(100vh - 80px - 48px);
  overflow-y: auto;
  scroll-behavior: smooth;
}

// 响应式
@media (max-width: 768px) {
  .admin-sidebar {
    width: 60px;
  }

  .menu-text {
    display: none;
  }

  .menu-item {
    justify-content: center;
    padding: 12px;
  }

  .admin-main {
    margin-left: 60px;
    padding: 16px;
  }
}
</style>
