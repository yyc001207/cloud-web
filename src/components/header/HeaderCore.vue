<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DateTimeWidget from '../DateTimeWidget.vue'
import WeatherWidget from '../WeatherWidget.vue'
import WeatherDetailModal from '../WeatherDetailModal.vue'
import CalendarModal from '../CalendarModal.vue'
import { useRouter } from 'vue-router'
import { useWeather } from '../../composables/useWeather'
import { useAuthStore } from '../../stores/auth'

const showWeatherModal = ref(false)
const showCalendarModal = ref(false)
const router = useRouter()
const authStore = useAuthStore()

async function handleUserCommand(command: string) {
  if (command === 'logout') {
    await authStore.logout()
    router.push('/login')
  }
}

const {
  currentWeather,
  stats,
  hourlyForecast,
  dailyForecast,
  loading,
  error,
  init,
  refresh,
} = useWeather()

onMounted(() => {
  init()
})

function handleLogoClick(path: string) {
  router.push(path)
}

function openWeatherModal() {
  showWeatherModal.value = true
}

function openCalendarModal() {
  showCalendarModal.value = true
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo" @click="handleLogoClick('/home')">云巢</div>
      <div class="admin" @click="handleLogoClick('/admin')">系统管理</div>
    </div>

    <div class="header-right">
      <div class="widget-container">
        <DateTimeWidget @click="openCalendarModal" />
        <div class="divider"></div>
        <WeatherWidget
          :loading="loading"
          :error="error"
          :temperature="currentWeather?.temperature ?? null"
          :condition="currentWeather?.icon ?? ''"
          :location-name="currentWeather?.location ?? ''"
          @click="openWeatherModal"
        />
      </div>

      <el-dropdown trigger="click" @command="handleUserCommand">
        <div class="user-avatar">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User avatar"
          />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">
              <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">logout</span>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>

  <!-- Modals -->
  <WeatherDetailModal
    v-model:visible="showWeatherModal"
    :loading="loading"
    :error="error"
    :current-weather="currentWeather"
    :stats="stats"
    :hourly-forecast="hourlyForecast"
    :daily-forecast="dailyForecast"
    :refresh="refresh"
  />
  <CalendarModal v-model:visible="showCalendarModal" />
</template>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: var(--surface);
  border-bottom: 1px solid rgba(61, 74, 62, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  font-family: 'Manrope', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--on-surface);
  cursor: pointer;
  letter-spacing: -0.02em;

  transition: color 0.2s ease;
}
.admin {
  cursor: pointer;
  &:hover {
    color: var(--primary);
  }
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.widget-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: var(--surface-container-low);
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--surface-container);
  }
}

.divider {
  width: 1px;
  height: 32px;
  background: rgba(61, 74, 62, 0.3);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(111, 230, 146, 0.2);
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--primary);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
    height: 64px;
  }

  .header-left {
    gap: 20px;
  }

  .widget-container {
    display: none;
  }
}
</style>
