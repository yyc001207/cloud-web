<script setup lang="ts">
import HeaderCore from './header/HeaderCore.vue'
</script>

<template>
  <HeaderCore />
</template>

<style scoped lang="scss">
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

@media (max-width: 768px) {
  .nav-links {
    gap: 16px;
  }
}
</style>
