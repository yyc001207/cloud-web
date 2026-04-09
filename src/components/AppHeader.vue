<script setup lang="ts">
import { ref } from 'vue'
import DateTimeWidget from './DateTimeWidget.vue'
import WeatherWidget from './WeatherWidget.vue'
import WeatherDetailModal from './WeatherDetailModal.vue'
import CalendarModal from './CalendarModal.vue'

// Navigation state (reserved for future use)
// const activeNav = ref<'internal' | 'external'>('internal')
const showWeatherModal = ref(false)
const showCalendarModal = ref(false)

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
      <div class="logo">云巢</div>
    </div>

    <div class="header-right">
      <div class="widget-container">
        <DateTimeWidget @click="openCalendarModal" />
        <div class="divider"></div>
        <WeatherWidget @click="openWeatherModal" />
      </div>

      <div class="user-avatar">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          alt="User avatar"
        />
      </div>
    </div>
  </header>

  <!-- Modals -->
  <WeatherDetailModal v-model:visible="showWeatherModal" />
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
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  position: relative;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(229, 226, 225, 0.6);
  text-decoration: none;
  padding-bottom: 4px;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--primary);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--primary);
  }

  &.active {
    color: var(--primary);
    font-weight: 700;

    &::after {
      transform: scaleX(1);
    }
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

.calendar-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary);
    background: rgba(111, 230, 146, 0.1);
  }

  .material-symbols-outlined {
    font-size: 22px;
  }
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

  .nav-links {
    gap: 16px;
  }

  .widget-container {
    display: none;
  }
}
</style>
