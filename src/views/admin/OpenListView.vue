<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getGlobalConfig,
  addGlobalConfig,
  updateGlobalConfig,
  deleteGlobalConfig,
  getTaskConfigList,
  addTaskConfig,
  updateTaskConfig,
  deleteTaskConfig,
  executeTask,
  cancelTask,
  getRunningTasks,
  getLatestResults,
  getTaskHistory,
} from '../../api/openlist'
import type {
  OpenListGlobalConfigItem,
  OpenListGlobalConfigCreateRequest,
  OpenListGlobalConfigUpdateRequest,
  OpenListTaskConfigItem,
  OpenListTaskConfigCreateRequest,
  OpenListTaskConfigUpdateRequest,
  OpenListExecuteRequest,
  RunningTaskItem,
  LatestResultItem,
  TaskHistoryLatestDetail,
  TaskHistoryListItem,
} from '../../types/openlist'

const activeTab = ref('global')

const globalConfigData = ref<OpenListGlobalConfigItem | null>(null)
const globalLoading = ref(false)

const globalDialogVisible = ref(false)
const globalDialogTitle = ref('新增全局配置')
const globalFormRef = ref<FormInstance>()
const globalIsEdit = ref(false)
const globalSubmitLoading = ref(false)

const globalFormData = reactive<{
  id?: number
  baseUrl: string
  token: string
  videoExtensionsStr: string
  subtitleExtensionsStr: string
}>({
  baseUrl: '',
  token: '',
  videoExtensionsStr: '',
  subtitleExtensionsStr: '',
})

function parseExtensionsStr(str: string): string[] | null {
  const list = str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  return list.length > 0 ? list : null
}

function extensionsToStr(arr: string[] | null): string {
  return arr ? arr.join(', ') : ''
}

const globalRules = computed<FormRules>(() => ({
  baseUrl: [{ required: true, message: '请输入服务器地址', trigger: 'blur' }],
  token: globalIsEdit.value
    ? []
    : [{ required: true, message: '请输入Token', trigger: 'blur' }],
}))

async function loadGlobalData() {
  globalLoading.value = true
  try {
    const res = await getGlobalConfig()
    globalConfigData.value = res.data || null
  } catch {
    globalConfigData.value = null
  } finally {
    globalLoading.value = false
  }
}

function handleGlobalAdd() {
  globalIsEdit.value = false
  globalDialogTitle.value = '新增全局配置'
  globalFormData.id = undefined
  globalFormData.baseUrl = ''
  globalFormData.token = ''
  globalFormData.videoExtensionsStr = ''
  globalFormData.subtitleExtensionsStr = ''
  globalDialogVisible.value = true
}

function handleGlobalEdit() {
  if (!globalConfigData.value) return
  globalIsEdit.value = true
  globalDialogTitle.value = '编辑全局配置'
  globalFormData.id = globalConfigData.value.id
  globalFormData.baseUrl = globalConfigData.value.baseUrl
  globalFormData.token = ''
  globalFormData.videoExtensionsStr = extensionsToStr(
    globalConfigData.value.videoExtensions,
  )
  globalFormData.subtitleExtensionsStr = extensionsToStr(
    globalConfigData.value.subtitleExtensions,
  )
  globalDialogVisible.value = true
}

async function handleGlobalSubmit() {
  if (!globalFormRef.value) return
  await globalFormRef.value.validate(async valid => {
    if (!valid) return
    globalSubmitLoading.value = true
    try {
      if (globalIsEdit.value) {
        const data: OpenListGlobalConfigUpdateRequest = {
          baseUrl: globalFormData.baseUrl,
          token: globalFormData.token || undefined,
          videoExtensions: parseExtensionsStr(
            globalFormData.videoExtensionsStr,
          ),
          subtitleExtensions: parseExtensionsStr(
            globalFormData.subtitleExtensionsStr,
          ),
        }
        await updateGlobalConfig(globalFormData.id!, data)
        ElMessage.success('编辑成功')
      } else {
        const data: OpenListGlobalConfigCreateRequest = {
          baseUrl: globalFormData.baseUrl,
          token: globalFormData.token,
          videoExtensions: parseExtensionsStr(
            globalFormData.videoExtensionsStr,
          ),
          subtitleExtensions: parseExtensionsStr(
            globalFormData.subtitleExtensionsStr,
          ),
        }
        await addGlobalConfig(data)
        ElMessage.success('新增成功')
      }
      globalDialogVisible.value = false
      loadGlobalData()
    } catch {
    } finally {
      globalSubmitLoading.value = false
    }
  })
}

async function handleGlobalDelete() {
  if (!globalConfigData.value) return
  await ElMessageBox.confirm('确定删除该全局配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteGlobalConfig(globalConfigData.value.id)
    ElMessage.success('删除成功')
    loadGlobalData()
  } catch {}
}

const taskTableData = ref<OpenListTaskConfigItem[]>([])
const taskLoading = ref(false)
const searchName = ref('')
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTotal = ref(0)
const taskSelectedRows = ref<OpenListTaskConfigItem[]>([])
const taskSortState = ref<{ orderBy: string | null; orderDir: string | null }>({
  orderBy: null,
  orderDir: null,
})

const taskDialogVisible = ref(false)
const taskDialogTitle = ref('新增任务配置')
const taskFormRef = ref<FormInstance>()
const taskIsEdit = ref(false)
const taskSubmitLoading = ref(false)

const taskFormData = reactive<{
  id?: number
  name: string
  taskPaths: string
  outputDir: string | null
  maxScanDepth: number | null
}>({
  name: '',
  taskPaths: '',
  outputDir: null,
  maxScanDepth: null,
})

const taskRules: FormRules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  taskPaths: [{ required: true, message: '请输入处理路径', trigger: 'blur' }],
}

async function loadTaskData() {
  taskLoading.value = true
  try {
    const res = await getTaskConfigList({
      pageNum: taskCurrentPage.value,
      pageSize: taskPageSize.value,
      name: searchName.value || null,
      orderBy: taskSortState.value.orderBy,
      orderDir: taskSortState.value.orderDir,
    })
    taskTableData.value = res.data || []
    taskTotal.value = res.total || 0
  } catch {
  } finally {
    taskLoading.value = false
  }
}

function handleTaskSearch() {
  taskCurrentPage.value = 1
  loadTaskData()
}

function handleTaskReset() {
  searchName.value = ''
  taskCurrentPage.value = 1
  loadTaskData()
}

function handleTaskAdd() {
  taskIsEdit.value = false
  taskDialogTitle.value = '新增任务配置'
  taskFormData.id = undefined
  taskFormData.name = ''
  taskFormData.taskPaths = ''
  taskFormData.outputDir = null
  taskFormData.maxScanDepth = null
  taskDialogVisible.value = true
}

function handleTaskEdit(row: OpenListTaskConfigItem) {
  taskIsEdit.value = true
  taskDialogTitle.value = '编辑任务配置'
  taskFormData.id = row.id
  taskFormData.name = row.name
  taskFormData.taskPaths = row.taskPaths
  taskFormData.outputDir = row.outputDir
  taskFormData.maxScanDepth = row.maxScanDepth
  taskDialogVisible.value = true
}

function handleTaskCopy(row: OpenListTaskConfigItem) {
  taskIsEdit.value = false
  taskDialogTitle.value = '复制任务配置'
  taskFormData.id = undefined
  taskFormData.name = `${row.name} (副本)`
  taskFormData.taskPaths = row.taskPaths
  taskFormData.outputDir = row.outputDir
  taskFormData.maxScanDepth = row.maxScanDepth
  taskDialogVisible.value = true
}

async function handleTaskSubmit() {
  if (!taskFormRef.value) return
  await taskFormRef.value.validate(async valid => {
    if (!valid) return
    taskSubmitLoading.value = true
    try {
      if (taskIsEdit.value) {
        const data: OpenListTaskConfigUpdateRequest = {
          name: taskFormData.name,
          taskPaths: taskFormData.taskPaths,
          outputDir: taskFormData.outputDir,
          maxScanDepth: taskFormData.maxScanDepth,
        }
        await updateTaskConfig(taskFormData.id!, data)
        ElMessage.success('编辑成功')
      } else {
        const data: OpenListTaskConfigCreateRequest = {
          name: taskFormData.name,
          taskPaths: taskFormData.taskPaths,
          outputDir: taskFormData.outputDir,
          maxScanDepth: taskFormData.maxScanDepth,
        }
        await addTaskConfig(data)
        ElMessage.success('新增成功')
      }
      taskDialogVisible.value = false
      loadTaskData()
    } catch {
    } finally {
      taskSubmitLoading.value = false
    }
  })
}

async function handleTaskDelete(row: OpenListTaskConfigItem) {
  await ElMessageBox.confirm('确定删除该任务配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteTaskConfig(row.id)
    ElMessage.success('删除成功')
    loadTaskData()
  } catch {}
}

async function handleTaskBatchDelete() {
  if (taskSelectedRows.value.length === 0) return
  await ElMessageBox.confirm(
    `确定删除选中的 ${taskSelectedRows.value.length} 个任务配置吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
  try {
    await Promise.all(
      taskSelectedRows.value.map(row => deleteTaskConfig(row.id)),
    )
    ElMessage.success('删除成功')
    loadTaskData()
  } catch {}
}

function handleTaskSelectionChange(rows: OpenListTaskConfigItem[]) {
  taskSelectedRows.value = rows
}

function handleTaskSortChange({
  prop,
  order,
}: {
  prop: string
  order: string | null
}) {
  if (order) {
    taskSortState.value.orderBy = prop
    taskSortState.value.orderDir = order === 'ascending' ? 'asc' : 'desc'
  } else {
    taskSortState.value.orderBy = null
    taskSortState.value.orderDir = null
  }
  taskCurrentPage.value = 1
  loadTaskData()
}

const executeGlobalOptions = ref<OpenListGlobalConfigItem[]>([])
const executeTaskOptions = ref<OpenListTaskConfigItem[]>([])
const executeLoading = ref(false)

const executeFormData = reactive<{
  globalConfigId: number | null
  taskConfigId: number | null
  incrementalMode: boolean
  force: boolean
}>({
  globalConfigId: null,
  taskConfigId: null,
  incrementalMode: true,
  force: false,
})

const runningTasks = ref<RunningTaskItem[]>([])
const runningLoading = ref(false)

async function loadExecuteOptions() {
  try {
    const [globalRes, taskRes] = await Promise.all([
      getGlobalConfig(),
      getTaskConfigList({ pageSize: 1000 }),
    ])
    executeGlobalOptions.value = globalRes.data ? [globalRes.data] : []
    executeTaskOptions.value = taskRes.data || []
  } catch {}
}

async function handleExecute() {
  if (!executeFormData.globalConfigId) {
    ElMessage.warning('请选择全局配置')
    return
  }
  if (!executeFormData.taskConfigId) {
    ElMessage.warning('请选择任务配置')
    return
  }
  executeLoading.value = true
  try {
    const data: OpenListExecuteRequest = {
      globalConfigId: executeFormData.globalConfigId,
      taskConfigId: executeFormData.taskConfigId,
      incrementalMode: executeFormData.incrementalMode,
      force: executeFormData.force,
    }
    await executeTask(data)
    loadRunningTasks()
    ElMessage.success('任务执行成功')
  } catch {
  } finally {
    executeLoading.value = false
  }
}

async function loadRunningTasks() {
  runningLoading.value = true
  try {
    const res = await getRunningTasks()
    runningTasks.value = res.data || []
  } catch {
    runningTasks.value = []
  } finally {
    runningLoading.value = false
  }
}

async function handleCancelRunning(taskId: string) {
  await ElMessageBox.confirm('确定取消该任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await cancelTask(taskId)
    ElMessage.success('任务已取消')
    loadRunningTasks()
  } catch {}
}

const historyList = ref<LatestResultItem[]>([])
const historyLoading = ref(false)

const historyDetailVisible = ref(false)
const historyDetailLoading = ref(false)
const historyDetailData = ref<TaskHistoryLatestDetail | null>(null)
const historyDetailTaskName = ref('')
const historyDetailHistoryList = ref<TaskHistoryListItem[]>([])

async function loadHistoryList() {
  historyLoading.value = true
  try {
    const res = await getLatestResults()
    historyList.value = res.data || []
  } catch {
    historyList.value = []
  } finally {
    historyLoading.value = false
  }
}

async function handleHistoryDetail(row: LatestResultItem) {
  historyDetailVisible.value = true
  historyDetailLoading.value = true
  historyDetailData.value = null
  historyDetailTaskName.value = ''
  historyDetailHistoryList.value = []
  try {
    const res = await getTaskHistory({ taskConfigId: row.taskConfigId })
    historyDetailTaskName.value = res.data?.taskName || row.taskName
    historyDetailData.value = res.data?.latestDetail || null
    historyDetailHistoryList.value = res.data?.historyList || []
  } catch {
    historyDetailData.value = null
    historyDetailHistoryList.value = []
  } finally {
    historyDetailLoading.value = false
  }
}

function getStatusType(
  status: string,
): 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'completed' || status === 'success' || status === '成功')
    return 'success'
  if (status === 'running' || status === '运行中') return 'warning'
  if (status === 'failed' || status === '失败') return 'danger'
  return 'info'
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    running: '运行中',
    pending: '等待中',
    completed: '已完成',
    success: '成功',
    failed: '失败',
    cancelled: '已取消',
    成功: '成功',
    失败: '失败',
    运行中: '运行中',
  }
  return map[status] || status
}

const logMessages = ref<string[]>([])
const logConnected = ref(false)
const logConnecting = ref(false)
let logWs: WebSocket | null = null
let pingInterval: ReturnType<typeof setInterval> | null = null
const logContainerRef = ref<HTMLElement | null>(null)
const logAutoScroll = ref(true)

function getWsUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const token = localStorage.getItem('token') || ''
  return `${protocol}//${window.location.host}/api/openlist/ws/logs?token=${encodeURIComponent(token)}`
}

function handleLogConnect() {
  if (
    logWs &&
    (logWs.readyState === WebSocket.OPEN ||
      logWs.readyState === WebSocket.CONNECTING)
  ) {
    return
  }
  logConnecting.value = true
  logConnected.value = false
  const wsUrl = getWsUrl()
  logWs = new WebSocket(wsUrl)

  logWs.onopen = () => {
    logConnected.value = true
    logConnecting.value = false
    pingInterval = setInterval(() => {
      if (logWs && logWs.readyState === WebSocket.OPEN) {
        logWs.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000)
  }

  logWs.onmessage = event => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'pong') return
    } catch {}
    logMessages.value.push(event.data)
    nextTick(() => {
      scrollToBottom()
    })
  }

  logWs.onclose = () => {
    logConnected.value = false
    logConnecting.value = false
    if (pingInterval) {
      clearInterval(pingInterval)
      pingInterval = null
    }
    logWs = null
  }

  logWs.onerror = () => {
    logConnected.value = false
    logConnecting.value = false
    if (pingInterval) {
      clearInterval(pingInterval)
      pingInterval = null
    }
    ElMessage.error('WebSocket 连接失败')
    logWs = null
  }
}

function handleLogDisconnect() {
  if (logWs) {
    logWs.close()
    logWs = null
  }
  if (pingInterval) {
    clearInterval(pingInterval)
    pingInterval = null
  }
  logConnected.value = false
  logConnecting.value = false
}

function handleLogClear() {
  logMessages.value = []
}

function scrollToBottom() {
  if (!logAutoScroll.value || !logContainerRef.value) return

  const container = logContainerRef.value
  const distanceToBottom =
    container.scrollHeight - (container.scrollTop + container.clientHeight)

  if (distanceToBottom < 100) {
    container.scrollTop = container.scrollHeight
  }
}

function handleTabClick(tab: string) {
  activeTab.value = tab
  if (tab === 'execute') {
    loadExecuteOptions()
    loadRunningTasks()
  }
  if (tab === 'history') {
    loadHistoryList()
  }
}

watch([taskCurrentPage, taskPageSize], () => {
  loadTaskData()
})

watch(activeTab, val => {
  if (val === 'execute') {
    loadRunningTasks()
  }
  if (val === 'history') {
    loadHistoryList()
  }
})

onMounted(() => {
  loadGlobalData()
  loadTaskData()
  loadExecuteOptions()
})
</script>

<template>
  <div class="openlist-view">
    <h1 class="page-title">OpenList管理</h1>

    <div class="tab-nav">
      <button
        :class="['tab-btn', { active: activeTab === 'global' }]"
        @click="handleTabClick('global')"
      >
        全局配置
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'task' }]"
        @click="handleTabClick('task')"
      >
        任务配置
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'execute' }]"
        @click="handleTabClick('execute')"
      >
        执行管理
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'history' }]"
        @click="handleTabClick('history')"
      >
        任务历史
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'log' }]"
        @click="handleTabClick('log')"
      >
        实时日志
      </button>
    </div>

    <div
      v-if="activeTab === 'global'"
      v-loading="globalLoading"
      class="tab-content"
    >
      <div v-if="!globalConfigData" class="global-empty">
        <p class="empty-text">暂无全局配置，请先新增</p>
        <el-button type="success" @click="handleGlobalAdd">
          <span class="material-symbols-outlined btn-icon">add</span>
          新增全局配置
        </el-button>
      </div>

      <div v-else class="global-detail">
        <div class="detail-header">
          <h3 class="detail-title">配置信息</h3>
          <div class="detail-actions">
            <el-button type="success" @click="handleGlobalEdit">
              <span class="material-symbols-outlined btn-icon">edit</span>
              编辑
            </el-button>
            <el-button type="danger" @click="handleGlobalDelete">
              <span class="material-symbols-outlined btn-icon">delete</span>
              删除
            </el-button>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">服务器地址</span>
            <span class="detail-value">{{ globalConfigData.baseUrl }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Token</span>
            <span class="detail-value token-masked">{{
              globalConfigData.tokenMasked
            }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">视频格式</span>
            <span class="detail-value">
              <template
                v-if="
                  globalConfigData.videoExtensions &&
                  globalConfigData.videoExtensions.length > 0
                "
              >
                <el-tag
                  v-for="ext in globalConfigData.videoExtensions"
                  :key="ext"
                  size="small"
                  class="ext-tag"
                  >{{ ext }}</el-tag
                >
              </template>
              <span v-else>-</span>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">字幕格式</span>
            <span class="detail-value">
              <template
                v-if="
                  globalConfigData.subtitleExtensions &&
                  globalConfigData.subtitleExtensions.length > 0
                "
              >
                <el-tag
                  v-for="ext in globalConfigData.subtitleExtensions"
                  :key="ext"
                  size="small"
                  class="ext-tag"
                  >{{ ext }}</el-tag
                >
              </template>
              <span v-else>-</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'task'" class="tab-content">
      <div class="search-bar">
        <el-input
          v-model="searchName"
          placeholder="请输入任务名称"
          clearable
          class="search-input"
          @keyup.enter="handleTaskSearch"
        />
        <el-button type="success" @click="handleTaskSearch">
          <span class="material-symbols-outlined btn-icon">search</span>
          查询
        </el-button>
        <el-button @click="handleTaskReset">
          <span class="material-symbols-outlined btn-icon">refresh</span>
          重置
        </el-button>
      </div>

      <div class="action-bar">
        <el-button type="success" @click="handleTaskAdd">
          <span class="material-symbols-outlined btn-icon">add</span>
          新增任务配置
        </el-button>
        <el-button
          type="danger"
          :disabled="taskSelectedRows.length === 0"
          @click="handleTaskBatchDelete"
          v-if="taskSelectedRows.length > 0"
        >
          <span class="material-symbols-outlined btn-icon">delete</span>
          批量删除{{
            taskSelectedRows.length > 0 ? `(${taskSelectedRows.length})` : ''
          }}
        </el-button>
      </div>

      <el-table
        :data="taskTableData"
        v-loading="taskLoading"
        @selection-change="handleTaskSelectionChange"
        @sort-change="handleTaskSortChange"
        max-height="calc(100vh - 420px)"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column
          type="index"
          label="序号"
          width="70"
          :index="(i: number) => (taskCurrentPage - 1) * taskPageSize + i + 1"
        />
        <el-table-column
          prop="name"
          label="名称"
          min-width="150"
          sortable="custom"
        />
        <el-table-column
          prop="outputDir"
          label="输出目录"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.outputDir || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="taskPaths"
          label="处理路径"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="maxScanDepth" label="扫描深度" width="100">
          <template #default="{ row }">
            {{ row.maxScanDepth ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="success" @click="handleTaskEdit(row)"
              >编辑</el-button
            >
            <el-button link type="info" @click="handleTaskCopy(row)"
              >复制</el-button
            >
            <el-button link type="danger" @click="handleTaskDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="taskCurrentPage"
          v-model:page-size="taskPageSize"
          :total="taskTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </div>

    <div v-if="activeTab === 'execute'" class="tab-content">
      <div class="execute-section">
        <h3 class="section-title">执行任务</h3>
        <el-form label-width="120px" class="execute-form">
          <el-form-item label="选择全局配置">
            <el-select
              v-model="executeFormData.globalConfigId"
              placeholder="请选择全局配置"
              style="width: 100%"
            >
              <el-option
                v-for="item in executeGlobalOptions"
                :key="item.id"
                :label="item.baseUrl"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择任务配置">
            <el-select
              v-model="executeFormData.taskConfigId"
              placeholder="请选择任务配置"
              style="width: 100%"
            >
              <el-option
                v-for="item in executeTaskOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="增量更新">
            <el-switch v-model="executeFormData.incrementalMode" />
          </el-form-item>
          <el-form-item label="强制重新生成">
            <el-switch v-model="executeFormData.force" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              :loading="executeLoading"
              @click="handleExecute"
            >
              <span class="material-symbols-outlined btn-icon">play_arrow</span>
              执行
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="execute-section">
        <div class="section-header">
          <h3 class="section-title">运行中任务</h3>
          <el-button size="small" @click="loadRunningTasks">
            <span class="material-symbols-outlined btn-icon">refresh</span>
            刷新
          </el-button>
        </div>
        <el-table
          :data="runningTasks"
          v-loading="runningLoading"
          empty-text="暂无运行中任务"
          max-height="300"
        >
          <el-table-column
            prop="taskId"
            label="任务ID"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="taskConfigName"
            label="任务名称"
            min-width="150"
          />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">{{
                getStatusLabel(row.status)
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button
                link
                type="danger"
                @click="handleCancelRunning(row.taskId)"
                >取消</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div
      v-if="activeTab === 'history'"
      v-loading="historyLoading"
      class="tab-content"
    >
      <div class="section-header" style="margin-bottom: 16px">
        <el-button size="small" @click="loadHistoryList">
          <span class="material-symbols-outlined btn-icon">refresh</span>
          刷新
        </el-button>
      </div>
      <el-table
        :data="historyList"
        empty-text="暂无执行历史"
        max-height="calc(100vh - 320px)"
      >
        <el-table-column type="index" label="序号" width="70" />
        <el-table-column prop="taskName" label="任务名称" min-width="150" />
        <el-table-column prop="executionStatus" label="执行状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.executionStatus)" size="small">{{
              getStatusLabel(row.executionStatus)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="执行信息" min-width="220">
          <template #default="{ row }">
            {{ row.executionInfo }}
          </template>
        </el-table-column>
        <el-table-column label="执行时间" width="200">
          <template #default="{ row }">
            {{ row.executionTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="success" @click="handleHistoryDetail(row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        v-model="historyDetailVisible"
        title="任务执行详情"
        width="640px"
        @close="
          historyDetailData = null;
          historyDetailHistoryList = []
        "
      >
        <div v-loading="historyDetailLoading">
          <template v-if="historyDetailData">
            <div class="detail-grid" style="margin-bottom: 24px">
              <div class="detail-item">
                <span class="detail-label">任务名称</span>
                <span class="detail-value">{{ historyDetailTaskName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">执行状态</span>
                <span class="detail-value">
                  <el-tag
                    :type="getStatusType(historyDetailData.executionStatus)"
                    size="small"
                    >{{
                      getStatusLabel(historyDetailData.executionStatus)
                    }}</el-tag
                  >
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">总视频数</span>
                <span class="detail-value">{{
                  historyDetailData.totalVideos ?? '-'
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">成功视频数</span>
                <span class="detail-value">{{
                  historyDetailData.successVideos ?? '-'
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">成功字幕数</span>
                <span class="detail-value">{{
                  historyDetailData.successSubtitles ?? '-'
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">失败字幕数</span>
                <span class="detail-value">{{
                  historyDetailData.errorSubtitles ?? '-'
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">执行时间</span>
                <span class="detail-value">{{
                  historyDetailData.executionTime
                }}</span>
              </div>
            </div>
          </template>

          <h4
            style="
              font-size: 1rem;
              font-weight: 600;
              color: var(--on-surface);
              margin-bottom: 12px;
            "
          >
            历史执行记录
          </h4>
          <el-table
            :data="historyDetailHistoryList"
            empty-text="暂无历史记录"
            max-height="300"
            size="small"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="executionStatus" label="状态" width="100">
              <template #default="{ row }">
                <el-tag
                  :type="getStatusType(row.executionStatus)"
                  size="small"
                  >{{ getStatusLabel(row.executionStatus) }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="执行信息" min-width="200">
              <template #default="{ row }">
                {{ row.executionInfo }}
              </template>
            </el-table-column>
            <el-table-column label="执行时间" width="180">
              <template #default="{ row }">
                {{ row.executionTime }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>

    <div v-if="activeTab === 'log'" class="tab-content">
      <div class="log-toolbar">
        <div class="log-status">
          <span
            class="status-dot"
            :class="{ connected: logConnected, connecting: logConnecting }"
          ></span>
          <span class="status-text">{{
            logConnected ? '已连接' : logConnecting ? '连接中...' : '未连接'
          }}</span>
          <el-switch
            v-model="logAutoScroll"
            active-text="自动滚动"
            inactive-text="自动滚动"
            style="margin-left: 16px"
          />
        </div>
        <div class="log-actions">
          <el-button
            v-if="!logConnected && !logConnecting"
            type="success"
            size="small"
            @click="handleLogConnect"
          >
            <span class="material-symbols-outlined btn-icon">link</span>
            连接
          </el-button>
          <el-button
            v-if="logConnected || logConnecting"
            type="danger"
            size="small"
            @click="handleLogDisconnect"
          >
            <span class="material-symbols-outlined btn-icon">link_off</span>
            断开
          </el-button>
          <el-button
            size="small"
            @click="handleLogClear"
            :disabled="logMessages.length === 0"
          >
            <span class="material-symbols-outlined btn-icon">delete_sweep</span>
            清空
          </el-button>
        </div>
      </div>
      <div ref="logContainerRef" class="log-container">
        <div v-if="logMessages.length === 0" class="log-empty">
          <p class="empty-text">暂无日志，请点击"连接"按钮开始接收</p>
        </div>
        <div v-for="(msg, index) in logMessages" :key="index" class="log-line">
          {{ msg }}
        </div>
      </div>
    </div>

    <el-dialog
      v-model="globalDialogVisible"
      :title="globalDialogTitle"
      width="480px"
    >
      <el-form
        ref="globalFormRef"
        :model="globalFormData"
        :rules="globalRules"
        label-width="100px"
      >
        <el-form-item label="服务器地址" prop="baseUrl">
          <el-input
            v-model="globalFormData.baseUrl"
            placeholder="请输入服务器地址"
          />
        </el-form-item>
        <el-form-item label="Token" prop="token">
          <el-input
            v-model="globalFormData.token"
            type="password"
            show-password
            :placeholder="globalIsEdit ? '留空则不修改' : '请输入Token'"
          />
        </el-form-item>
        <el-form-item label="视频格式">
          <el-input
            v-model="globalFormData.videoExtensionsStr"
            placeholder="请输入视频格式，逗号分隔，如 .mp4, .mkv"
          />
        </el-form-item>
        <el-form-item label="字幕格式">
          <el-input
            v-model="globalFormData.subtitleExtensionsStr"
            placeholder="请输入字幕格式，逗号分隔，如 .srt, .ass"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="globalDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="globalSubmitLoading"
          @click="handleGlobalSubmit"
          >确定</el-button
        >
      </template>
    </el-dialog>

    <el-dialog
      v-model="taskDialogVisible"
      :title="taskDialogTitle"
      width="480px"
    >
      <el-form
        ref="taskFormRef"
        :model="taskFormData"
        :rules="taskRules"
        label-width="80px"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskFormData.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="处理路径" prop="taskPaths">
          <el-input
            v-model="taskFormData.taskPaths"
            placeholder="请输入处理路径"
          />
        </el-form-item>
        <el-form-item label="输出目录">
          <el-input
            v-model="taskFormData.outputDir as string"
            placeholder="请输入输出目录"
          />
        </el-form-item>
        <el-form-item label="扫描深度">
          <el-input-number
            v-model="taskFormData.maxScanDepth as number"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="taskDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="taskSubmitLoading"
          @click="handleTaskSubmit"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.openlist-view {
  display: flex;
  flex-direction: column;
  height: 100%;

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--on-surface);
    margin-bottom: 24px;
    flex-shrink: 0;
  }

  .tab-nav {
    display: flex;
    padding: 6px;
    background: var(--surface-container-lowest);
    border-radius: 9999px;
    border: 1px solid rgba(61, 74, 62, 0.1);
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 4px;
    flex-shrink: 0;
  }

  .tab-btn {
    padding: 10px 24px;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    background: transparent;
    border: none;
    color: var(--on-surface-variant);
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
      background: var(--primary);
      color: var(--on-primary);
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(111, 230, 146, 0.2);
    }

    &:hover:not(.active) {
      color: var(--on-surface);
    }
  }

  .tab-content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-shrink: 0;

    .search-input {
      width: 240px;
    }
  }

  .action-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .btn-icon {
    font-size: 16px;
    vertical-align: middle;
    margin-right: 4px;
  }

  .pagination-bar {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .tag-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .ext-tag {
    margin-right: 4px;
  }

  .global-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    gap: 16px;

    .empty-text {
      font-size: 1rem;
      color: var(--on-surface-variant);
    }
  }

  .global-detail {
    background: var(--surface-container-lowest);
    border: 1px solid rgba(61, 74, 62, 0.1);
    border-radius: 12px;
    padding: 24px;
  }

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .detail-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--on-surface);
    margin: 0;
  }

  .detail-actions {
    display: flex;
    gap: 8px;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-label {
    font-size: 0.75rem;
    color: var(--on-surface-variant);
    font-weight: 500;
  }

  .detail-value {
    font-size: 0.875rem;
    color: var(--on-surface);
    word-break: break-all;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .token-masked {
    font-family: monospace;
  }

  .execute-section {
    margin-bottom: 32px;

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .section-header .section-title {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--on-surface);
      margin-bottom: 16px;
    }

    .execute-form {
      max-width: 560px;
    }
  }

  .log-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-shrink: 0;

    .log-status {
      display: flex;
      align-items: center;
      gap: 8px;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--on-surface-variant);
        opacity: 0.4;

        &.connected {
          background: #6fe692;
          opacity: 1;
        }

        &.connecting {
          background: #e6a23c;
          opacity: 1;
          animation: pulse 1s infinite;
        }
      }

      .status-text {
        font-size: 0.875rem;
        color: var(--on-surface-variant);
      }
    }

    .log-actions {
      display: flex;
      gap: 8px;
    }
  }

  .log-container {
    flex: 1;
    min-height: 0;
    height: calc(100vh - 280px);
    overflow-y: auto;
    background: var(--surface-container-lowest);
    border: 1px solid rgba(61, 74, 62, 0.1);
    border-radius: 12px;
    padding: 16px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.8125rem;
    line-height: 1.6;

    .log-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;

      .empty-text {
        font-size: 0.875rem;
        color: var(--on-surface-variant);
        opacity: 0.6;
      }
    }

    .log-line {
      white-space: pre-wrap;
      word-break: break-all;
      color: var(--on-surface);
      padding: 2px 0;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
}
</style>
