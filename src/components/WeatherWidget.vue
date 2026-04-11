<script setup lang="ts">
import { computed } from 'vue'

defineEmits<{
  click: []
}>()

interface Props {
  loading?: boolean
  error?: string | null
  temperature?: number | null
  condition?: string
  locationName?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  temperature: null,
  condition: '',
  locationName: '',
})

function mapWeatherIcon(iconCode: string): string {
  if (iconCode === '100' || iconCode === '150') return 'wb_sunny'
  if (['101', '102', '151', '152'].includes(iconCode))
    return 'partly_cloudy_day'
  if (['103', '104', '153', '154'].includes(iconCode)) return 'cloud'
  if (iconCode.startsWith('3')) return 'rainy'
  if (iconCode.startsWith('4')) return 'thunderstorm'
  if (iconCode.startsWith('5')) return 'foggy'
  if (iconCode.startsWith('6')) return 'ac_unit'
  return 'partly_cloudy_day'
}

const weatherIcon = computed(() => {
  if (props.loading) return 'progress_activity'
  if (props.error && props.temperature === null) return 'error_outline'
  return mapWeatherIcon(props.condition)
})

const displayTemperature = computed(() => {
  if (props.temperature === null || props.loading) return '--°C'
  return `${props.temperature}°C`
})

const displayLocation = computed(() => {
  if (props.loading) return '定位中...'
  if (props.error) return '定位失败'
  return props.locationName
})
</script>

<template>
  <div class="weather-widget" @click="$emit('click')">
    <span
      class="material-symbols-outlined weather-icon"
      :class="{ spinning: loading }"
      >{{ weatherIcon }}</span
    >
    <div class="weather-info">
      <span class="temperature">{{ displayTemperature }}</span>
      <span class="location">{{ displayLocation }}</span>
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

  &.spinning {
    animation: spin 1s linear infinite;
  }
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
