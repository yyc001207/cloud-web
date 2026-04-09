<script setup lang="ts">
defineEmits<{
  click: []
}>()

interface Props {
  temperature?: number
  location?: string
  district?: string
}

withDefaults(defineProps<Props>(), {
  temperature: 22,
  location: '深圳',
  district: '南山区'
})
</script>

<template>
  <div class="weather-widget" @click="$emit('click')">
    <span class="material-symbols-outlined weather-icon">wb_sunny</span>
    <div class="weather-info">
      <span class="temperature">{{ temperature }}°C</span>
      <span class="location">{{ location }}, {{ district }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-widget {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.weather-icon {
  font-size: 24px;
  color: var(--primary);
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.temperature {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--on-surface);
}

.location {
  font-size: 0.625rem;
  color: var(--on-surface-variant);
}
</style>
