<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getTextList,
  addText,
  deleteText,
  getFileList,
  createFile,
  uploadChunk,
  completeFile,
  deleteFile,
} from '../../api/transfer'
import type { TextTransferItem, FileTransferItem } from '../../types/transfer'

const activeTab = ref('text')

const textList = ref<TextTransferItem[]>([])
const textLoading = ref(false)
const textCurrentPage = ref(1)
const textPageSize = ref(20)
const textTotal = ref(0)
const messageContainer = ref<HTMLElement | null>(null)

const newContent = ref('')
const submitLoading = ref(false)

async function loadTextList() {
  textLoading.value = true
  try {
    const res = await getTextList({
      pageNum: textCurrentPage.value,
      pageSize: textPageSize.value,
    })
    textList.value = res.data || []
    textTotal.value = res.total || 0
    await nextTick()
    scrollToBottom()
  } catch {
  } finally {
    textLoading.value = false
  }
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

async function handleAddText() {
  if (!newContent.value.trim()) {
    ElMessage.warning('请输入文本内容')
    return
  }
  submitLoading.value = true
  try {
    await addText({
      content: newContent.value.trim(),
    })
    ElMessage.success('添加成功')
    newContent.value = ''
    textCurrentPage.value = 1
    await loadTextList()
  } catch {
  } finally {
    submitLoading.value = false
  }
}

async function handleCopyText(content: string) {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('已复制')
  } catch {
    ElMessage.error('复制失败')
  }
}

async function handleDeleteText(item: TextTransferItem) {
  await ElMessageBox.confirm('确定删除该文本吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteText(item.id)
    ElMessage.success('删除成功')
    loadTextList()
  } catch {}
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

watch([textCurrentPage, textPageSize], () => {
  loadTextList()
})

const fileList = ref<FileTransferItem[]>([])
const fileLoading = ref(false)
const fileCurrentPage = ref(1)
const filePageSize = ref(10)
const fileTotal = ref(0)
const fileKeyword = ref('')
const fileOrderBy = ref<string | null>(null)
const fileOrderDir = ref<string | null>(null)
const fileSelectedRows = ref<FileTransferItem[]>([])

const uploadingFiles = ref<Map<string, number>>(new Map())
const fileInput = ref<HTMLInputElement | null>(null)

async function loadFileList() {
  fileLoading.value = true
  try {
    const res = await getFileList({
      pageNum: fileCurrentPage.value,
      pageSize: filePageSize.value,
      keyword: fileKeyword.value || null,
      orderBy: fileOrderBy.value,
      orderDir: fileOrderDir.value,
    })
    fileList.value = res.data || []
    fileTotal.value = res.total || 0
  } catch {
  } finally {
    fileLoading.value = false
  }
}

function handleFileSearch() {
  fileCurrentPage.value = 1
  loadFileList()
}

function handleFileReset() {
  fileKeyword.value = ''
  fileOrderBy.value = null
  fileOrderDir.value = null
  fileCurrentPage.value = 1
  loadFileList()
}

function handleSortChange({
  prop,
  order,
}: {
  prop: string
  order: string | null
}) {
  if (order) {
    fileOrderBy.value = prop
    fileOrderDir.value = order === 'ascending' ? 'asc' : 'desc'
  } else {
    fileOrderBy.value = null
    fileOrderDir.value = null
  }
  loadFileList()
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileStatus(status: string) {
  const map: Record<string, string> = {
    pending: '上传中',
    completed: '已完成',
  }
  return map[status] || status
}

function getFileStatusType(status: string) {
  const map: Record<string, string> = {
    pending: 'warning',
    completed: 'success',
  }
  return map[status] || 'info'
}

function triggerFileUpload() {
  fileInput.value?.click()
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  for (const file of Array.from(input.files)) {
    await uploadFile(file)
  }
  input.value = ''
  loadFileList()
}

async function uploadFile(file: File) {
  const CHUNK_SIZE = 5 * 1024 * 1024
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  const fileKey = `${file.name}-${file.size}`

  let fileHash = ''
  try {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    fileHash = `${file.name}-${file.size}-${Date.now()}`
  }

  try {
    const createRes = await createFile({
      filename: file.name,
      fileSize: file.size,
      fileHash,
      contentType: file.type || 'application/octet-stream',
    })
    const fileId = (createRes as { data: { id: number } }).data?.id
    if (!fileId) {
      ElMessage.error('创建文件记录失败')
      return
    }

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)

      uploadingFiles.value.set(
        fileKey,
        Math.round(((i + 1) / totalChunks) * 100),
      )

      await uploadChunk(fileId, i, chunk)
    }

    await completeFile({ fileId, totalChunks })
    uploadingFiles.value.delete(fileKey)
    ElMessage.success(`${file.name} 上传成功`)
  } catch {
    uploadingFiles.value.delete(fileKey)
    ElMessage.error(`${file.name} 上传失败`)
  }
}

async function handleDeleteFile(row: FileTransferItem) {
  await ElMessageBox.confirm('确定删除该文件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteFile(row.id)
    ElMessage.success('删除成功')
    loadFileList()
  } catch {}
}

async function handleBatchDeleteFile() {
  if (fileSelectedRows.value.length === 0) return
  await ElMessageBox.confirm(
    `确定删除选中的 ${fileSelectedRows.value.length} 个文件吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
  try {
    await Promise.all(fileSelectedRows.value.map(row => deleteFile(row.id)))
    ElMessage.success('删除成功')
    fileSelectedRows.value = []
    loadFileList()
  } catch {}
}

function handleFileSelectionChange(rows: FileTransferItem[]) {
  fileSelectedRows.value = rows
}

watch([fileCurrentPage, filePageSize], () => {
  loadFileList()
})

watch(activeTab, val => {
  if (val === 'text' && textList.value.length === 0) {
    loadTextList()
  } else if (val === 'file' && fileList.value.length === 0) {
    loadFileList()
  }
})

onMounted(() => {
  loadTextList()
})
</script>

<template>
  <div class="transfer-view">
    <h1 class="page-title">中转站</h1>

    <div class="tab-nav">
      <button
        :class="['tab-btn', { active: activeTab === 'text' }]"
        @click="activeTab = 'text'"
      >
        文本中转
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'file' }]"
        @click="activeTab = 'file'"
      >
        文件中转
      </button>
    </div>

    <div v-if="activeTab === 'text'" class="tab-content text-tab">
      <div
        ref="messageContainer"
        v-loading="textLoading"
        class="message-container"
      >
        <div v-if="textList.length === 0 && !textLoading" class="empty-state">
          <span class="material-symbols-outlined empty-icon">chat</span>
          <p class="empty-text">暂无文本记录</p>
        </div>
        <div v-for="item in textList" :key="item.id" class="message-bubble">
          <div class="bubble-header">
            <span v-if="item.title" class="bubble-title">{{ item.title }}</span>
            <span class="bubble-time">{{ formatTime(item.createdAt) }}</span>
          </div>
          <div class="bubble-content">{{ item.content }}</div>
          <div class="bubble-actions">
            <button
              class="action-btn copy-btn"
              @click="handleCopyText(item.content)"
            >
              <span class="material-symbols-outlined">content_copy</span>
              复制
            </button>
            <button
              class="action-btn delete-btn"
              @click="handleDeleteText(item)"
            >
              <span class="material-symbols-outlined">delete</span>
              删除
            </button>
          </div>
        </div>
      </div>

      <div class="text-pagination">
        <el-pagination
          v-model:current-page="textCurrentPage"
          v-model:page-size="textPageSize"
          :total="textTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>

      <div class="text-input-area">
        <div class="content-row">
          <el-input
            v-model="newContent"
            type="textarea"
            placeholder="输入文本内容..."
            :autosize="{ minRows: 1, maxRows: 4 }"
            class="content-input"
            @keyup.ctrl.enter="handleAddText"
          />
          <el-button
            type="success"
            :loading="submitLoading"
            @click="handleAddText"
            class="send-btn"
          >
            <span class="material-symbols-outlined btn-icon">send</span>
            发送
          </el-button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'file'" class="tab-content file-tab">
      <div class="search-bar">
        <el-input
          v-model="fileKeyword"
          placeholder="搜索文件名"
          clearable
          class="search-input"
          @keyup.enter="handleFileSearch"
        />
        <el-button type="success" @click="handleFileSearch">
          <span class="material-symbols-outlined btn-icon">search</span>
          查询
        </el-button>
        <el-button @click="handleFileReset">
          <span class="material-symbols-outlined btn-icon">refresh</span>
          重置
        </el-button>
      </div>

      <div class="action-bar">
        <el-button type="success" @click="triggerFileUpload">
          <span class="material-symbols-outlined btn-icon">upload</span>
          上传文件
        </el-button>
        <el-button
          v-if="fileSelectedRows.length > 0"
          type="danger"
          @click="handleBatchDeleteFile"
        >
          <span class="material-symbols-outlined btn-icon">delete</span>
          批量删除({{ fileSelectedRows.length }})
        </el-button>
        <input
          ref="fileInput"
          type="file"
          multiple
          style="display: none"
          @change="handleFileSelect"
        />
      </div>

      <div
        v-for="[key, progress] of uploadingFiles"
        :key="key"
        class="upload-progress-item"
      >
        <span class="upload-name">{{ key.split('-')[0] }}</span>
        <el-progress
          :percentage="progress"
          :stroke-width="6"
          class="upload-bar"
        />
      </div>

      <div class="table-wrapper">
        <el-table
          :data="fileList"
          v-loading="fileLoading"
          @selection-change="handleFileSelectionChange"
          @sort-change="handleSortChange"
          max-height="calc(100vh - 400px)"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="(i: number) => (fileCurrentPage - 1) * filePageSize + i + 1"
          />
          <el-table-column
            prop="filename"
            label="文件名"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="fileSize" label="大小" width="120">
            <template #default="{ row }">
              {{ formatFileSize(row.fileSize) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getFileStatusType(row.status)" size="small">
                {{ getFileStatus(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="上传时间"
            width="180"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatTime(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button link type="danger" @click="handleDeleteFile(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="fileCurrentPage"
          v-model:page-size="filePageSize"
          :total="fileTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.transfer-view {
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
    display: flex;
    flex-direction: column;
  }

  .btn-icon {
    font-size: 16px;
    vertical-align: middle;
    margin-right: 4px;
  }
}

.text-tab {
  .message-container {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px;
    background: var(--surface-container-lowest);
    border: 1px solid rgba(61, 74, 62, 0.1);
    border-radius: 12px;
    margin-bottom: 12px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    gap: 12px;

    .empty-icon {
      font-size: 48px;
      color: var(--on-surface-variant);
      opacity: 0.4;
    }

    .empty-text {
      font-size: 0.875rem;
      color: var(--on-surface-variant);
      opacity: 0.6;
    }
  }

  .message-bubble {
    background: var(--surface-container-high);
    border: 1px solid rgba(61, 74, 62, 0.15);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 12px;
    transition: background 0.2s ease;

    &:hover {
      background: var(--surface-container-highest);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .bubble-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    gap: 8px;
  }

  .bubble-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--primary);
  }

  .bubble-time {
    font-size: 0.75rem;
    color: var(--on-surface-variant);
    opacity: 0.6;
    flex-shrink: 0;
  }

  .bubble-content {
    font-size: 0.875rem;
    color: var(--on-surface);
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .bubble-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    justify-content: flex-end;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 12px;
    border: none;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;

    .material-symbols-outlined {
      font-size: 14px;
    }
  }

  .copy-btn {
    background: rgba(111, 230, 146, 0.12);
    color: var(--primary);

    &:hover {
      background: rgba(111, 230, 146, 0.25);
    }
  }

  .delete-btn {
    background: rgba(245, 108, 108, 0.12);
    color: #f56c6c;

    &:hover {
      background: rgba(245, 108, 108, 0.25);
    }
  }

  .text-pagination {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
    flex-shrink: 0;
  }

  .text-input-area {
    flex-shrink: 0;
    background: var(--surface-container-lowest);
    border: 1px solid rgba(61, 74, 62, 0.1);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .content-row {
      display: flex;
      gap: 8px;
      align-items: flex-end;

      .content-input {
        flex: 1;
      }

      .send-btn {
        flex-shrink: 0;
        height: 40px;
      }
    }
  }
}

.file-tab {
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

  .upload-progress-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    padding: 8px 12px;
    background: var(--surface-container-lowest);
    border: 1px solid rgba(61, 74, 62, 0.1);
    border-radius: 8px;

    .upload-name {
      font-size: 0.875rem;
      color: var(--on-surface);
      flex-shrink: 0;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .upload-bar {
      flex: 1;
    }
  }

  .table-wrapper {
    flex: 1;
    min-height: 0;
  }

  .pagination-bar {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}
</style>
