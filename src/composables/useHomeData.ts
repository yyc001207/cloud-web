import { ref, computed } from 'vue'
import { getTabList } from '../api/tab'
import { getWebsiteList } from '../api/website'
import type { TabItem } from '../types/tab'
import type { WebsiteItem } from '../types/website'

export function useHomeData() {
    const tabs = ref<TabItem[]>([])
    const websites = ref<WebsiteItem[]>([])
    const activeTabId = ref<number | null>(null)
    const loading = ref(false)

    const sortedWebsites = computed(() => {
        return [...websites.value].sort((a, b) => {
            if (a.order === null && b.order === null) return 0
            if (a.order === null) return 1
            if (b.order === null) return -1
            return a.order - b.order
        })
    })

    async function loadTabs() {
        try {
            const res = await getTabList({})
            tabs.value = res.data || []
        } catch {}
    }

    async function loadWebsites() {
        loading.value = true
        try {
            const res = await getWebsiteList({
                tabId: activeTabId.value,
                pageNum: 1,
                pageSize: 9999,
            })
            websites.value = res.data || []
        } catch {
        } finally {
            loading.value = false
        }
    }

    async function init() {
        await loadTabs()
        if (tabs.value.length > 0) {
            activeTabId.value = tabs.value[0].id
        }
        await loadWebsites()
    }

    async function switchTab(tabId: number | null) {
        activeTabId.value = tabId
        await loadWebsites()
    }

    async function refresh() {
        await loadWebsites()
    }

    return {
        tabs,
        websites: sortedWebsites,
        activeTabId,
        loading,
        switchTab,
        refresh,
        init,
    }
}
