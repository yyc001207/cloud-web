import { ref, readonly } from 'vue'
import { getHolidayList } from '../api/holiday'

const holidayDates = ref<string[]>([])
const adjustmentDates = ref<string[]>([])
const loading = ref(false)
let initialized = false

function parseDates(items: { holiday: string; adjustment: string }[]): { holidays: string[]; adjustments: string[] } {
    const holidays: string[] = []
    const adjustments: string[] = []

    for (const item of items) {
        if (item.holiday) {
            const dates = item.holiday.split(',').map(d => d.trim()).filter(Boolean)
            holidays.push(...dates)
        }
        if (item.adjustment) {
            const dates = item.adjustment.split(',').map(d => d.trim()).filter(Boolean)
            adjustments.push(...dates)
        }
    }

    return { holidays, adjustments }
}

async function fetchHolidayData() {
    loading.value = true
    try {
        const res = await getHolidayList({})
        const items = res.data as unknown as { holiday: string; adjustment: string }[]
        const parsed = parseDates(items)
        holidayDates.value = parsed.holidays
        adjustmentDates.value = parsed.adjustments
    } catch {
        holidayDates.value = []
        adjustmentDates.value = []
    } finally {
        loading.value = false
    }
}

async function init() {
    if (initialized) return
    initialized = true
    await fetchHolidayData()
}

async function refresh() {
    await fetchHolidayData()
}

export function useHoliday() {
    return {
        holidayDates,
        adjustmentDates,
        loading: readonly(loading),
        init,
        refresh,
    }
}
