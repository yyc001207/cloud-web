import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ViewMode = 'icon' | 'card'
export type NetworkMode = 'internal' | 'external'

export const useAppStore = defineStore('app', () => {
  // State
  const viewMode = ref<ViewMode>('icon')
  const networkMode = ref<NetworkMode>('internal')

  // Getters
  const isIconMode = computed(() => viewMode.value === 'icon')
  const isCardMode = computed(() => viewMode.value === 'card')
  const isInternalNetwork = computed(() => networkMode.value === 'internal')
  const isExternalNetwork = computed(() => networkMode.value === 'external')

  // Actions
  function setViewMode(mode: ViewMode) {
    viewMode.value = mode
  }

  function setNetworkMode(mode: NetworkMode) {
    networkMode.value = mode
  }

  function toggleViewMode() {
    viewMode.value = viewMode.value === 'icon' ? 'card' : 'icon'
  }

  function toggleNetworkMode() {
    networkMode.value = networkMode.value === 'internal' ? 'external' : 'internal'
  }

  return {
    // State
    viewMode,
    networkMode,
    // Getters
    isIconMode,
    isCardMode,
    isInternalNetwork,
    isExternalNetwork,
    // Actions
    setViewMode,
    setNetworkMode,
    toggleViewMode,
    toggleNetworkMode
  }
})
