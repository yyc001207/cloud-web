<script setup lang="ts">
// openList管理页面
</script>

<template>
  <div class="openlist-view">
    <h1 class="page-title">openList管理</h1>
    <div class="page-content">
      <p class="placeholder-text">openList管理功能开发中...</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.openlist-view {
  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--on-surface);
    margin-bottom: 24px;
  }

  .page-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .placeholder-text {
    font-size: 1rem;
    color: var(--on-surface-variant);
    opacity: 0.6;
  }
}
</style>
