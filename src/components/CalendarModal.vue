<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  getLunarDay,
  getLunarMonth,
  getSolarTerm,
  getFestival,
  getYiJi,
  getNextFestivalCountdown,
  classifyDate,
} from '../utils/lunar'
import { useHoliday } from '../composables/useHoliday'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const { holidayDates, adjustmentDates, init: initHoliday } = useHoliday()

onMounted(() => {
  initHoliday()
})

// 当前显示的月份
const currentYear = ref(2024)
const currentMonth = ref(10) // 0-11
const selectedDate = ref(9)
const weekStart = ref<'monday' | 'sunday'>('sunday')

const weekDays = computed(() => {
  if (weekStart.value === 'monday') {
    return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  }
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
})

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const daysInMonth = lastDay.getDate()

  let firstDayOfWeek = firstDay.getDay()
  if (weekStart.value === 'monday') {
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  }

  // 上月日期
  const prevMonthLastDay = new Date(
    currentYear.value,
    currentMonth.value,
    0,
  ).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      month: 'prev',
      date: new Date(
        currentYear.value,
        currentMonth.value - 1,
        prevMonthLastDay - i,
      ),
    })
  }

  // 当月日期
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i)
    const isToday =
      today.getDate() === i &&
      today.getMonth() === currentMonth.value &&
      today.getFullYear() === currentYear.value

    // 获取农历信息
    const festival = getFestival(date)
    const solarTerm = getSolarTerm(date)
    const lunarDay = getLunarDay(date)
    const lunarMonth = getLunarMonth(date)
    const lunarText = festival || solarTerm || `${lunarMonth}${lunarDay}`

    // 获取日期分类（假期/调休/普通）
    const dateClassification = classifyDate(
      date,
      holidayDates.value,
      adjustmentDates.value,
    )

    days.push({
      day: i,
      month: 'current',
      date,
      isToday,
      lunarText,
      isHoliday: !!festival,
      holidayType: solarTerm ? 'solar' : festival ? 'holiday' : undefined,
      dateClassification,
    })
  }

  // 下月日期
  const remainingCells = 42 - days.length
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      day: i,
      month: 'next',
      date: new Date(currentYear.value, currentMonth.value + 1, i),
    })
  }

  return days
})

const selectedDateInfo = computed(() => {
  const date = new Date(
    currentYear.value,
    currentMonth.value,
    selectedDate.value,
  )
  const weekDay = date
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase()

  // 获取农历信息
  const lunarDay = getLunarDay(date)
  const lunarMonth = getLunarMonth(date)
  const solarTerm = getSolarTerm(date)
  const festival = getFestival(date)
  const yiJi = getYiJi(date)

  const lunarText = `${lunarMonth}${lunarDay}`

  // 获取下一个节日倒计时（基于选中的日期）
  const selectedDateObj = new Date(
    currentYear.value,
    currentMonth.value,
    selectedDate.value,
  )
  const nextFestival = getNextFestivalCountdown(selectedDateObj)
  const daysToNextFestival = nextFestival ? nextFestival.days : 0
  const nextFestivalName = nextFestival ? nextFestival.name : '元旦'

  return {
    day: selectedDate.value.toString().padStart(2, '0'),
    weekDay,
    fullDate: `${currentYear.value}年${currentMonth.value + 1}月${selectedDate.value}日`,
    lunarText,
    yearGanZhi: '甲辰年',
    solarTerm: solarTerm || festival || '',
    yi: yiJi.yi.join('、') || '诸事不宜',
    ji: yiJi.ji.join('、') || '诸事不宜',
    nextFestivalName,
    daysToNextFestival,
  }
})

const monthNames = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
]

function closeModal() {
  emit('update:visible', false)
}

function selectDate(day: number) {
  selectedDate.value = day
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function goToToday() {
  const today = new Date()
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  selectedDate.value = today.getDate()
}

// 监听 visible 变化，打开时重置到今天
watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      goToToday()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="modal-overlay" @click.self="closeModal">
        <div class="calendar-modal">
          <!-- Header -->
          <div class="modal-header">
            <div class="date-selectors">
              <button class="selector-btn" @click="prevMonth">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <div class="current-ym">
                <span class="year">{{ currentYear }}年</span>
                <span class="month">{{ monthNames[currentMonth] }}</span>
              </div>
              <button class="selector-btn" @click="nextMonth">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div class="header-actions">
              <div class="week-start-toggle">
                <button
                  :class="['toggle-btn', { active: weekStart === 'monday' }]"
                  @click="weekStart = 'monday'"
                >
                  周一始
                </button>
                <button
                  :class="['toggle-btn', { active: weekStart === 'sunday' }]"
                  @click="weekStart = 'sunday'"
                >
                  周日始
                </button>
              </div>
              <button class="icon-btn" @click="goToToday">
                <span class="material-symbols-outlined">today</span>
              </button>
              <button class="icon-btn" @click="closeModal">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="calendar-scroll-container">
            <div class="calendar-body">
              <!-- Week Days Header -->
              <div class="week-days">
                <div v-for="day in weekDays" :key="day" class="week-day">
                  {{ day }}
                </div>
              </div>

              <!-- Days Grid -->
              <div class="days-grid">
                <div
                  v-for="(dayInfo, index) in calendarDays"
                  :key="index"
                  :class="[
                    'day-cell',
                    {
                      'other-month': dayInfo.month !== 'current',
                      'is-today': dayInfo.isToday,
                      'is-selected':
                        dayInfo.day === selectedDate &&
                        dayInfo.month === 'current',
                      'is-holiday':
                        dayInfo.isHoliday && dayInfo.holidayType === 'holiday',
                      'is-solar':
                        dayInfo.isHoliday && dayInfo.holidayType === 'solar',
                      'is-vacation': dayInfo.dateClassification === 'holiday',
                      'is-adjustment':
                        dayInfo.dateClassification === 'adjustment',
                    },
                  ]"
                  @click="
                    dayInfo.month === 'current' && selectDate(dayInfo.day)
                  "
                >
                  <span class="day-number">{{ dayInfo.day }}</span>
                  <span v-if="dayInfo.month === 'current'" class="lunar-text">
                    {{ dayInfo.lunarText }}
                  </span>
                  <span
                    v-if="dayInfo.dateClassification === 'holiday'"
                    class="date-marker vacation-marker"
                    >假</span
                  >
                  <span
                    v-if="dayInfo.dateClassification === 'adjustment'"
                    class="date-marker adjustment-marker"
                    >班</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Info Panel -->
          <div class="info-panel">
            <div class="date-info">
              <div class="big-date">
                <span class="day-number-large">{{ selectedDateInfo.day }}</span>
                <span class="week-day">{{ selectedDateInfo.weekDay }}</span>
              </div>
              <div class="divider"></div>
              <div class="detail-info">
                <div class="full-date-row">
                  <span class="full-date">{{ selectedDateInfo.fullDate }}</span>
                  <span class="lunar-badge"
                    >{{ selectedDateInfo.yearGanZhi }}
                    {{ selectedDateInfo.lunarText }}</span
                  >
                  <span class="solar-term" v-if="selectedDateInfo.solarTerm">{{
                    selectedDateInfo.solarTerm
                  }}</span>
                </div>
                <div class="yi-ji-row">
                  <div class="yi">
                    <span class="badge yi-badge">宜</span>
                    <span class="content">{{ selectedDateInfo.yi }}</span>
                  </div>
                  <div class="ji">
                    <span class="badge ji-badge">忌</span>
                    <span class="content">{{ selectedDateInfo.ji }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="countdown-cards">
              <div class="countdown-card">
                <div class="countdown-icon">
                  <span class="material-symbols-outlined">event_upcoming</span>
                </div>
                <div class="countdown-info">
                  <span class="countdown-label"
                    >距离{{ selectedDateInfo.nextFestivalName }}</span
                  >
                  <span class="countdown-value"
                    >{{ selectedDateInfo.daysToNextFestival }}天</span
                  >
                </div>
              </div>
              <div class="countdown-card">
                <div class="countdown-icon secondary">
                  <span class="material-symbols-outlined"
                    >history_toggle_off</span
                  >
                </div>
                <div class="countdown-info">
                  <span class="countdown-label">距离今天</span>
                  <span class="countdown-value">SELECTED</span>
                </div>
              </div>
            </div>
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
}

.calendar-modal {
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  background: rgba(28, 27, 27, 0.85);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6);
}

.modal-header {
  padding: 16px 24px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.date-selectors {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selector-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: var(--on-surface);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
}

.current-ym {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--on-surface);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.week-start-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.toggle-btn {
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: var(--primary);
    color: var(--on-primary);
    box-shadow: 0 4px 12px rgba(111, 230, 146, 0.2);
  }

  &:hover:not(.active) {
    color: var(--on-surface);
  }
}

.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--on-surface);
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
}

.calendar-scroll-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(80vh - 200px);
  padding: 0 24px 16px;

  // Custom scrollbar styling
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }
}

.calendar-body {
  min-height: min-content;
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.week-day {
  text-align: center;
  padding: 6px;
  font-family: 'Manrope', sans-serif;
  font-size: 0.5rem;
  font-weight: 800;
  color: var(--on-surface-variant);
  opacity: 0.6;
  letter-spacing: 0.15em;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-cell {
  position: relative;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 2px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: scale(1.05);
  }

  &.other-month {
    opacity: 0.2;
    pointer-events: none;
  }

  &.is-today {
    background: rgba(111, 230, 146, 0.1);
    border: 2px solid rgba(111, 230, 146, 0.5);
    box-shadow: 0 0 25px rgba(111, 230, 146, 0.1);

    .day-number {
      color: var(--primary);
      font-weight: 800;
    }
  }

  &.is-selected {
    background: var(--primary) !important;
    border-color: var(--primary) !important;
    box-shadow: 0 8px 32px rgba(111, 230, 146, 0.4);
    transform: scale(1.05);
    z-index: 1;

    .day-number,
    .lunar-text {
      color: var(--on-primary) !important;
      font-weight: 800;
    }

    // Override vacation and adjustment backgrounds when selected
    &.is-vacation,
    &.is-adjustment {
      background: var(--primary) !important;
      border-color: var(--primary) !important;

      .day-number,
      .lunar-text {
        color: var(--on-primary) !important;
      }
    }
  }

  &.is-holiday .lunar-text {
    color: #ffc0ac;
    font-weight: 600;
  }

  &.is-solar .lunar-text {
    color: #ffc0ac;
    font-weight: 600;
  }

  // 假期样式 - 红色透明背景
  &.is-vacation {
    background: rgba(239, 68, 68, 0.35);
    border-color: rgba(239, 68, 68, 0.3);

    &:hover {
      background: rgba(239, 68, 68, 0.45);
    }

    .day-number {
      color: #fca5a5;
    }

    .lunar-text {
      color: #fca5a5;
      opacity: 0.9;
    }
  }

  // 调休样式 - 黄色透明背景
  &.is-adjustment {
    background: rgba(234, 179, 8, 0.35);
    border-color: rgba(234, 179, 8, 0.3);

    &:hover {
      background: rgba(234, 179, 8, 0.45);
    }

    .day-number {
      color: #fde047;
    }

    .lunar-text {
      color: #fde047;
      opacity: 0.9;
    }
  }
}

.day-number {
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--on-surface);
}

.lunar-text {
  font-size: 0.5rem;
  color: var(--on-surface-variant);
  opacity: 0.7;
}

// 日期标记样式（假/班）
.date-marker {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 700;
  border-radius: 3px;
  line-height: 1;
}

.vacation-marker {
  background: rgba(239, 68, 68, 0.8);
  color: #fff;
}

.adjustment-marker {
  background: rgba(234, 179, 8, 0.8);
  color: #fff;
}

.info-panel {
  margin-top: auto;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.big-date {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-number-large {
  font-family: 'Manrope', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
  letter-spacing: -0.05em;
}

.big-date .week-day {
  font-size: 0.5rem;
  font-weight: 700;
  color: var(--on-surface);
  opacity: 0.4;
  letter-spacing: 0.2em;
  margin-top: 2px;
}

.divider {
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.full-date {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--on-surface);
}

.lunar-badge {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.solar-term {
  padding: 4px 10px;
  background: rgba(111, 230, 146, 0.1);
  border: 1px solid rgba(111, 230, 146, 0.2);
  border-radius: 8px;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--primary);
}

.yi-ji-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.yi,
.ji {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 700;
  flex-shrink: 0;
}

.yi-badge {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
}

.ji-badge {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.content {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  line-height: 1.4;
}

.countdown-cards {
  display: flex;
  gap: 8px;
}

.countdown-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  min-width: 140px;
}

.countdown-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(111, 230, 146, 0.2);
  border-radius: 8px;
  color: var(--primary);

  &.secondary {
    background: rgba(255, 255, 255, 0.05);
    color: var(--on-surface-variant);
  }

  .material-symbols-outlined {
    font-size: 16px;
  }
}

.countdown-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.countdown-label {
  font-size: 0.5rem;
  font-weight: 700;
  color: var(--on-surface);
  opacity: 0.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.countdown-value {
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--on-surface);
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

@media (max-width: 768px) {
  .calendar-modal {
    border-radius: 1.5rem;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .calendar-body {
    padding: 0 20px 16px;
  }

  .days-grid {
    gap: 8px;
  }

  .day-cell {
    border-radius: 1rem;
  }

  .day-number {
    font-size: 1rem;
  }

  .info-panel {
    padding: 16px 20px;
    flex-direction: column;
    align-items: flex-start;
  }

  .date-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .divider {
    display: none;
  }

  .day-number-large {
    font-size: 3rem;
  }

  .countdown-cards {
    width: 100%;
  }

  .countdown-card {
    flex: 1;
    min-width: 0;
  }
}
</style>
