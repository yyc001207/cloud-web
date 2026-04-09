<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import { resources } from '../data/resources'
import AppHeader from '../components/AppHeader.vue'
import ResourceIconCard from '../components/ResourceIconCard.vue'
import ResourceDetailCard from '../components/ResourceDetailCard.vue'

const appStore = useAppStore()
const { viewMode, networkMode } = storeToRefs(appStore)
</script>

<template>
  <div class="home-view">
    <AppHeader />

    <main class="main-content">
      <div class="container">
        <!-- Toolbar -->
        <div class="toolbar">
          <!-- Network Mode Switch -->
          <div class="network-switch">
            <button
              :class="['switch-btn', { active: networkMode === 'internal' }]"
              @click="appStore.setNetworkMode('internal')"
            >
              内网地址
            </button>
            <button
              :class="['switch-btn', { active: networkMode === 'external' }]"
              @click="appStore.setNetworkMode('external')"
            >
              外网地址
            </button>
          </div>

          <!-- View Mode Switch -->
          <div class="view-switch">
            <button
              :class="['view-btn', { active: viewMode === 'icon' }]"
              @click="appStore.setViewMode('icon')"
            >
              <span class="material-symbols-outlined">grid_view</span>
              图标模式
            </button>
            <button
              :class="['view-btn', { active: viewMode === 'card' }]"
              @click="appStore.setViewMode('card')"
            >
              <span class="material-symbols-outlined">view_agenda</span>
              卡片模式
            </button>
          </div>
        </div>

        <!-- Resource Grid -->
        <Transition name="fade" mode="out-in">
          <div
            v-if="viewMode === 'icon'"
            key="icon"
            class="icon-grid"
          >
            <ResourceIconCard
              v-for="resource in resources"
              :key="resource.id"
              :resource="resource"
            />
          </div>
          <div
            v-else
            key="card"
            class="card-list"
          >
            <ResourceDetailCard
              v-for="resource in resources"
              :key="resource.id"
              :resource="resource"
            />
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  min-height: 100vh;
  background: var(--surface);
}

.main-content {
  padding-top: 80px;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.network-switch {
  display: flex;
  padding: 6px;
  background: var(--surface-container-lowest);
  border-radius: 9999px;
  border: 1px solid rgba(61, 74, 62, 0.1);
}

.switch-btn {
  padding: 10px 24px;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: var(--primary);
    color: var(--on-primary);
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(111, 230, 146, 0.2);
  }

  &:hover:not(.active) {
    color: var(--on-surface);
  }
}

.view-switch {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  background: var(--surface-container-low);
  border-radius: 12px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: var(--surface-container-high);
    color: var(--primary);
    font-weight: 700;
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.05);
    color: var(--on-surface);
  }

  .material-symbols-outlined {
    font-size: 18px;
  }
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(6, 1fr);
  }
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 64px;
  }

  .container {
    padding: 20px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .network-switch,
  .view-switch {
    justify-content: center;
  }

  .icon-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>
