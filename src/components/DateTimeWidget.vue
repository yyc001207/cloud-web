<script setup lang="ts">
import { Lunar } from 'lunar-javascript'
import { onMounted, onUnmounted, ref } from 'vue'
const currentDate = ref('')
const currentTime = ref('')

// 使用 lunar-javascript 获取农历日期
function getLunarDate(date: Date): string {
  const lunar = Lunar.fromDate(date)
  const lunarMonth = lunar.getMonthInChinese()
  const lunarDay = lunar.getDayInChinese()
  return `${lunarMonth}月${lunarDay}`
}

function updateDateTime() {
  const now = new Date()

  // 格式化时间 HH:mm:ss
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  // 格式化日期 M月D日 农历xx月xx
  const month = now.getMonth() + 1
  const day = now.getDate()
  const lunar = getLunarDate(now)

  currentDate.value = `${month}月${day}日 农历${lunar}`
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
