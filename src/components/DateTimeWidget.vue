<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getLunarDay, getLunarMonth } from '../utils/lunar'

const currentTime = ref('')
const currentDate = ref('')

// 使用 lunar-javascript 库获取准确农历日期
function getLunarDate(date: Date): string {
  const lunarMonth = getLunarMonth(date)
  const lunarDay = getLunarDay(date)
  return `${lunarMonth}${lunarDay}`
}

function updateDateTime() {
  const now = new Date()

  // 格式化时间 HH:mm:ss
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // 格式化日期 YYYY年M月D日 农历xx月xx
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const lunar = getLunarDate(now)

  currentDate.value = `${year}年${month}月${day}日 农历${lunar}`
}

let timer: number | null = null

onMounted(() => {
  updateDateTime()
  timer = window.setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="datetime-widget">
    <div class="time">{{ currentTime }}</div>
    <div class="date">{{ currentDate }}</div>
  </div>
</template>

<style scoped lang="scss">
.datetime-widget {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.time {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.date {
  font-size: 0.625rem;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
