<script setup lang="ts">
import type { WebsiteItem } from '../types/website'

interface Props {
  website: WebsiteItem
  tabLabel: string
}

defineProps<Props>()
</script>

<template>
  <div class="resource-detail-card">
    <div class="card-left">
      <div class="icon-container">
        <div
          v-if="website.icon?.type === 'text' && website.icon.text"
          class="icon-text"
          :style="{
            backgroundColor: website.icon.backgroundColor || 'var(--primary)',
          }"
        >
          <span class="icon-text">{{ website.icon.text }}</span>
        </div>
        <img
          v-else-if="website.icon?.type === 'file' && website.icon.url"
          :src="website.icon.url"
          class="icon-img"
        />
        <span v-else class="material-symbols-outlined resource-icon"
          >language</span
        >
      </div>
      <div class="resource-info">
        <div class="name-row">
          <h3 class="resource-name">{{ website.label }}</h3>
          <span class="resource-tag">{{ tabLabel }}</span>
        </div>
        <p class="resource-description">{{ website.desc || '' }}</p>
      </div>
    </div>

    <div class="card-right">
      <div
        v-if="website.document && website.document.length > 0"
        class="resource-links"
      >
        <a
          v-for="doc in website.document"
          :key="doc.title"
          :href="doc.url"
          class="resource-link"
          target="_blank"
        >
          <span class="material-symbols-outlined link-icon">description</span>
          {{ doc.title }}
        </a>
      </div>
      <a :href="website.url" class="action-btn" target="_blank"> 访问 </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.resource-detail-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px;
  background: var(--surface-container-low);
  border-radius: 1.5rem;
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
      transform: scale(1.05);
    }

    .resource-name {
      color: var(--primary);
    }
  }
}

.card-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;
}

.icon-container {
  width: 56px;
  height: 56px;
  min-width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-container-highest);
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

.resource-icon {
  font-size: 28px;
  color: var(--primary);
}

.icon-text {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.icon-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.resource-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.resource-name {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--on-surface);
  transition: color 0.3s ease;
}

.resource-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(111, 230, 146, 0.1);
  color: #6fe692;
}

.resource-description {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 500px;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.resource-links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.resource-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #83fba5;
  }
}

.link-icon {
  font-size: 16px;
}

.action-btn {
  padding: 10px 24px;
  background: rgba(111, 230, 146, 0.1);
  border: none;
  border-radius: 12px;
  font-family: 'Manrope', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: var(--primary);
    color: var(--on-primary);
  }
}

@media (max-width: 768px) {
  .resource-detail-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-right {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .resource-links {
    flex-wrap: wrap;
  }

  .action-btn {
    width: 100%;
    text-align: center;
  }

  .resource-description {
    max-width: 100%;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
