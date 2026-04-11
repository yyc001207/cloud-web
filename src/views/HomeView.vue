<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import { useHomeData } from '../composables/useHomeData'
import AppHeader from '../components/AppHeader.vue'
import ResourceIconCard from '../components/ResourceIconCard.vue'
import ResourceDetailCard from '../components/ResourceDetailCard.vue'

const appStore = useAppStore()
const { viewMode } = storeToRefs(appStore)

const { tabs, websites, activeTabId, loading, switchTab, init } = useHomeData()

function getTabLabel(tabId: number): string {
  const tab = tabs.value.find(t => t.id === tabId)
  return tab?.label || ''
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="home-view">
    <AppHeader />

    <main class="main-content">
      <div class="container">
        <div class="toolbar">
          <div class="toolbar-left">
            <div class="tab-switch">
              <button
                :class="['tab-btn', { active: activeTabId === null }]"
                @click="switchTab(null)"
              >
                全部
              </button>
              <button
                v-for="tab in tabs"
                :key="tab.id"
                :class="['tab-btn', { active: activeTabId === tab.id }]"
                @click="switchTab(tab.id)"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
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

        <Transition name="fade" mode="out-in">
          <div
            v-if="viewMode === 'icon'"
            key="icon"
            class="icon-grid"
            v-loading="loading"
          >
            <ResourceIconCard
              v-for="website in websites"
              :key="website.id"
              :website="website"
              :tab-label="getTabLabel(website.tabId)"
            />
          </div>
          <div v-else key="card" class="card-list" v-loading="loading">
            <ResourceDetailCard
              v-for="website in websites"
              :key="website.id"
              :website="website"
              :tab-label="getTabLabel(website.tabId)"
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

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
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

.tab-switch {
  display: flex;
  padding: 6px;
  background: var(--surface-container-low);
  border-radius: 9999px;
  border: 1px solid rgba(61, 74, 62, 0.1);
}

.tab-btn {
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

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
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
