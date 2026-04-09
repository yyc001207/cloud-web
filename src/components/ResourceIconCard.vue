<script setup lang="ts">
import type { Resource } from '../data/resources'

interface Props {
  resource: Resource
}

defineProps<Props>()

const tagColorMap = {
  primary: 'rgba(111, 230, 146, 0.1)',
  secondary: 'rgba(171, 205, 205, 0.1)',
  tertiary: 'rgba(255, 192, 172, 0.1)'
}

const tagTextColorMap = {
  primary: '#6fe692',
  secondary: '#abcdcd',
  tertiary: '#ffc0ac'
}
</script>

<template>
  <div class="resource-icon-card">
    <div class="icon-container">
      <span class="material-symbols-outlined resource-icon">{{ resource.icon }}</span>
    </div>
    <h3 class="resource-name">{{ resource.name }}</h3>
    <span
      class="resource-tag"
      :style="{
        backgroundColor: tagColorMap[resource.tagColor],
        color: tagTextColorMap[resource.tagColor]
      }"
    >
      {{ resource.tag }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.resource-icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
  background: var(--surface-container-low);
  border-radius: 1rem;
  border: 1px solid rgba(61, 74, 62, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(42, 42, 42, 1) 0%,
      rgba(53, 53, 52, 1) 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(111, 230, 146, 0.15);

    .icon-container {
      transform: scale(1.1);
    }

    .resource-name {
      color: var(--primary);
    }
  }
}

.icon-container {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-container-highest);
  border-radius: 1rem;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.resource-icon {
  font-size: 32px;
  color: var(--primary);
}

.resource-name {
  font-family: 'Manrope', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 8px;
  transition: color 0.3s ease;
  line-height: 1.3;
}

.resource-tag {
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
