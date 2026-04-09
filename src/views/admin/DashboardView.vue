<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '../../components/AdminLayout.vue'

// 概览数据
const stats = ref([
  { label: '用户总数', value: 128, icon: 'group', color: 'primary' },
  { label: '菜单项', value: 24, icon: 'menu', color: 'secondary' },
  { label: '系统日志', value: 1024, icon: 'description', color: 'tertiary' },
  { label: '在线用户', value: 12, icon: 'online_prediction', color: 'error' }
])

const recentActivities = ref([
  { id: 1, action: '用户登录', user: 'admin', time: '2026-04-09 10:30:00' },
  { id: 2, action: '创建菜单', user: 'admin', time: '2026-04-09 09:15:00' },
  { id: 3, action: '修改配置', user: 'admin', time: '2026-04-09 08:45:00' },
  { id: 4, action: '用户登出', user: 'test', time: '2026-04-09 08:30:00' }
])
</script>

<template>
  <AdminLayout>
    <div class="dashboard-view">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card"
        >
          <div class="stat-icon" :class="stat.color">
            <span class="material-symbols-outlined">{{ stat.icon }}</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="activity-section">
        <h3 class="section-title">
          <span class="material-symbols-outlined">history</span>
          最近活动
        </h3>
        <div class="activity-list">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-dot"></div>
            <div class="activity-content">
              <div class="activity-action">{{ activity.action }}</div>
              <div class="activity-meta">
                <span class="activity-user">{{ activity.user }}</span>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped lang="scss">
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// 统计卡片
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid rgba(61, 74, 62, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.primary {
    background: rgba(111, 230, 146, 0.1);
    color: var(--primary);
  }

  &.secondary {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }

  &.tertiary {
    background: rgba(33, 150, 243, 0.1);
    color: #2196f3;
  }

  &.error {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
  }

  .material-symbols-outlined {
    font-size: 24px;
  }
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-family: 'Manrope', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--on-surface);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
}

// 最近活动
.activity-section {
  background: var(--surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(61, 74, 62, 0.1);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 20px;

  .material-symbols-outlined {
    color: var(--primary);
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(61, 74, 62, 0.05);

  &:last-child {
    border-bottom: none;
  }
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-action {
  font-weight: 500;
  color: var(--on-surface);
}

.activity-meta {
  display: flex;
  gap: 12px;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
}

.activity-user {
  color: var(--primary);
}
</style>
