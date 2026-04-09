<script setup lang="ts">
import { ref, useTemplateRef, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const currentWeather = ref({
  temperature: 22,
  condition: '多云',
  icon: '☁️',
  aqi: 45,
  aqiLevel: '优',
  location: '广东省深圳市南山区',
})

const stats = ref([
  { label: '风速', value: '3.5m/s' },
  { label: '湿度', value: '65%' },
  { label: '气压', value: '1012 hPa' },
  { label: '降水量', value: '0mm' },
  { label: '温度范围', value: '18° - 25°' },
  { label: '日出日落', value: '06:30  18:45' },
])

const hourlyForecast = ref([
  { time: '现在', icon: '☁️', temp: 22, active: true },
  { time: '14:00', icon: '☁️', temp: 23 },
  { time: '15:00', icon: '☀️', temp: 24 },
  { time: '16:00', icon: '☀️', temp: 24 },
  { time: '17:00', icon: '☁️', temp: 22 },
  { time: '18:00', icon: '☁️', temp: 21 },
  { time: '19:00', icon: '☁️', temp: 20 },
  { time: '20:00', icon: '☁️', temp: 19 },
  { time: '21:00', icon: '🌙', temp: 18 },
  { time: '22:00', icon: '🌙', temp: 17 },
  { time: '23:00', icon: '☁️', temp: 17 },
])

const dailyForecast = ref([
  { day: '今天', icon: '☁️', low: 18, high: 25 },
  { day: '周一', icon: '☀️', low: 19, high: 26 },
  { day: '周二', icon: '🌧️', low: 16, high: 21 },
  { day: '周三', icon: '🌧️', low: 15, high: 20 },
  { day: '周四', icon: '☁️', low: 17, high: 23 },
  { day: '周五', icon: '☁️', low: 18, high: 24, opacity: 0.6 },
  { day: '周六', icon: '☀️', low: 19, high: 27, opacity: 0.4 },
])

function closeModal() {
  emit('update:visible', false)
}

function refreshData() {
  // 刷新数据逻辑
  console.log('刷新天气数据')
}

// 24小时预报滚动导航
const hourlyScrollRef = useTemplateRef<HTMLElement>('hourlyScroll')

function scrollHourly(direction: 'left' | 'right') {
  if (!hourlyScrollRef.value) return

  const scrollAmount = 76 // 每次滚动一个项目的宽度（64px + 12px gap）
  const currentScroll = hourlyScrollRef.value.scrollLeft
  const targetScroll =
    direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount

  hourlyScrollRef.value.scrollTo({
    left: targetScroll,
    behavior: 'smooth',
  })
}

// 键盘导航支持
function handleKeydown(event: KeyboardEvent) {
  if (!props.visible) return

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    scrollHourly('left')
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    scrollHourly('right')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="modal-overlay" @click.self="closeModal">
        <div class="weather-modal">
          <!-- Header -->
          <div class="modal-header">
            <div class="location-info">
              <div class="location-label">
                <span class="material-symbols-outlined">location_on</span>
                <span>当前位置</span>
              </div>
              <h2 class="location-name">{{ currentWeather.location }}</h2>
            </div>
            <button class="close-btn" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Left: Current Weather -->
            <div class="current-weather">
              <div class="temperature-display">
                <span class="temp-value"
                  >{{ currentWeather.temperature }}°C</span
                >
                <div class="weather-status">
                  <div class="weather-icon-large">
                    {{ currentWeather.icon }}
                  </div>
                  <div class="weather-condition">
                    {{ currentWeather.condition }}
                  </div>
                </div>
              </div>

              <div class="aqi-badge">
                <span class="material-symbols-outlined">air</span>
                <span class="aqi-value"
                  >{{ currentWeather.aqi }} {{ currentWeather.aqiLevel }}</span
                >
                <span class="aqi-label">| 空气质量指数</span>
              </div>

              <!-- Stats Grid -->
              <div class="stats-grid">
                <div
                  v-for="(stat, index) in stats"
                  :key="index"
                  class="stat-item"
                >
                  <p class="stat-label">{{ stat.label }}</p>
                  <p class="stat-value">
                    {{ stat.value }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Right: Forecasts -->
            <div class="forecasts">
              <!-- 24H Forecast -->
              <section class="hourly-forecast">
                <h3 class="section-title">24小时预报</h3>
                <div class="hourly-forecast-container">
                  <button
                    class="nav-btn nav-btn-left"
                    @click="scrollHourly('left')"
                  >
                    <span class="material-symbols-outlined">chevron_left</span>
                  </button>
                  <div class="hourly-scroll-wrapper">
                    <div ref="hourlyScroll" class="hourly-scroll">
                      <div
                        v-for="(hour, index) in hourlyForecast"
                        :key="index"
                        :class="['hour-item', { active: hour.active }]"
                      >
                        <span class="hour-time">{{ hour.time }}</span>
                        <div class="hour-icon">{{ hour.icon }}</div>
                        <span class="hour-temp">{{ hour.temp }}°</span>
                      </div>
                    </div>
                  </div>
                  <button
                    class="nav-btn nav-btn-right"
                    @click="scrollHourly('right')"
                  >
                    <span class="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </section>

              <!-- 7-Day Forecast -->
              <section class="daily-forecast">
                <h3 class="section-title">7日天气预报</h3>
                <div class="daily-list">
                  <div
                    v-for="(day, index) in dailyForecast"
                    :key="index"
                    class="day-item"
                    :style="{ opacity: day.opacity || 1 }"
                  >
                    <span class="day-name">{{ day.day }}</span>
                    <div class="day-weather">
                      <span class="day-icon">{{ day.icon }}</span>
                      <div class="temp-bar">
                        <div
                          class="temp-range"
                          :style="{
                            left: `${(day.low - 10) * 3}%`,
                            right: `${100 - (day.high - 10) * 3}%`,
                          }"
                        ></div>
                      </div>
                    </div>
                    <span class="day-temps"
                      >{{ day.low }}° / {{ day.high }}°</span
                    >
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <div class="footer-meta">
              <span class="powered-by">Powered by 云巢 Curator Protocol</span>
              <span class="status-dot"></span>
              <span class="sync-status">数据实时同步</span>
            </div>
            <button class="refresh-btn" @click="refreshData">更新数据</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(14, 14, 14, 0.6);
  backdrop-filter: blur(4px);
}

.weather-modal {
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(53, 53, 52, 0.7);
  backdrop-filter: blur(20px);
  background-image: linear-gradient(
    135deg,
    rgba(111, 230, 146, 0.1) 0%,
    transparent 100%
  );
  border-radius: 12px;
  border: 1px solid rgba(61, 74, 62, 0.2);
  display: flex;
  flex-direction: column;
  margin: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.modal-header {
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  .material-symbols-outlined {
    font-size: 14px;
  }
}

.location-name {
  font-family: 'Manrope', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
}

.close-btn {
  padding: 8px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(229, 226, 225, 0.5);
  transition: all 0.2s ease;

  &:hover {
    background: var(--surface-container-high);
    color: var(--on-surface);
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
}

.modal-content {
  padding: 0 32px 24px;
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(450px, 2fr);
  gap: 32px;
  width: 100%;
}

.current-weather {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.temperature-display {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.temp-value {
  font-family: 'Manrope', sans-serif;
  font-size: 5rem;
  font-weight: 800;
  color: var(--on-surface);
  line-height: 1;
  letter-spacing: -0.04em;
}

.weather-status {
  margin-bottom: 12px;
}

.weather-icon-large {
  font-size: 2.5rem;
  line-height: 1;
}

.weather-condition {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary);
}

.aqi-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(111, 230, 146, 0.1);
  border: 1px solid rgba(111, 230, 146, 0.2);
  border-radius: 9999px;
  width: fit-content;

  .material-symbols-outlined {
    color: var(--primary);
    font-size: 20px;
  }
}

.aqi-value {
  color: var(--primary);
  font-weight: 700;
}

.aqi-label {
  color: rgba(229, 226, 225, 0.4);
  font-size: 0.875rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  padding: 12px;
  background: var(--surface-container-low);
  border: 1px solid rgba(61, 74, 62, 0.1);
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(111, 230, 146, 0.3);
  }
}

.stat-label {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  margin-bottom: 4px;
}

.stat-value {
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 14px;
  color: var(--tertiary);
}

.forecasts {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgba(229, 226, 225, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.hourly-forecast {
  width: 100%;
}

.hourly-forecast-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.hourly-scroll-wrapper {
  flex: 1;
  overflow: hidden;
  min-width: 0;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface);
  transition: all 0.2s ease;
  flex-shrink: 0;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
}

.hourly-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.hour-item {
  flex-shrink: 0;
  width: 64px;
  padding: 12px 8px;
  background: var(--surface-container-low);
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &.active {
    background: rgba(42, 42, 42, 0.5);
    border: 1px solid rgba(111, 230, 146, 0.2);
  }
}

.hour-time {
  font-size: 0.75rem;
  color: rgba(229, 226, 225, 0.6);
}

.hour-icon {
  font-size: 1.5rem;
}

.hour-temp {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  color: var(--on-surface);
}

.daily-forecast {
  width: 100%;
}

.daily-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(28, 27, 27, 0.4);
  border-radius: 12px;
  transition: background-color 0.2s ease;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;

  &:hover {
    background: var(--surface-container-low);
  }
}

.day-name {
  width: 48px;
  font-size: 0.875rem;
  color: rgba(229, 226, 225, 0.8);
  flex-shrink: 0;
}

.day-weather {
  flex: 1 1 0%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  min-width: 0;
}

.day-icon {
  font-size: 1.25rem;
}

.temp-bar {
  flex: 1 1 0%;
  height: 4px;
  background: var(--surface-container-highest);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  min-width: 40px;
}

.temp-range {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
}

.day-temps {
  width: 72px;
  text-align: right;
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  color: var(--on-surface);
  font-size: 0.875rem;
  flex-shrink: 0;
}

.modal-footer {
  margin-top: auto;
  padding: 16px 32px;
  background: rgba(14, 14, 14, 0.5);
  border-top: 1px solid rgba(61, 74, 62, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.powered-by {
  font-size: 0.625rem;
  color: rgba(229, 226, 225, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--primary);
}

.sync-status {
  font-size: 0.625rem;
  color: rgba(111, 230, 146, 0.8);
}

.refresh-btn {
  padding: 8px 24px;
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: 9999px;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 0 15px rgba(111, 230, 146, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .modal-content {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 0 24px 20px;
  }

  .temp-value {
    font-size: 4rem;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .modal-footer {
    padding: 16px 24px;
  }
}

@media (max-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 16px 16px;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-footer {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .temp-value {
    font-size: 3rem;
  }

  .weather-icon-large {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .stat-item {
    padding: 10px;
  }

  .day-item {
    padding: 10px 12px;
  }

  .day-weather {
    padding: 0 8px;
  }

  .hour-item {
    width: 60px;
    padding: 10px 6px;
  }

  .nav-btn {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 8px;
  }

  .temp-value {
    font-size: 2.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .day-name {
    width: 40px;
    font-size: 0.8rem;
  }

  .day-temps {
    width: 64px;
    font-size: 0.8rem;
  }

  .day-icon {
    font-size: 1rem;
  }

  .temp-bar {
    min-width: 30px;
  }

  .section-title {
    font-size: 0.7rem;
  }
}
</style>
