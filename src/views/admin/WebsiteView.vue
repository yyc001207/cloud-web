<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type {
  FormInstance,
  FormRules,
  UploadRequestOptions,
} from 'element-plus'
import {
  getWebsiteList,
  addWebsite,
  updateWebsite,
  deleteWebsite,
} from '../../api/website'
import type {
  WebsiteItem,
  WebsiteCreateRequest,
  WebsiteUpdateRequest,
  DocumentLink,
  IconInfo,
} from '../../types/website'
import { getTabList } from '../../api/tab'
import type { TabItem } from '../../types/tab'
import { uploadFile } from '../../api/upload'

const router = useRouter()

const tableData = ref<WebsiteItem[]>([])
const loading = ref(false)
const searchLabel = ref('')
const activeTabId = ref<number | null>(null)
const tabOptions = ref<TabItem[]>([])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('新增网站')
const formRef = ref<FormInstance>()
const isEdit = ref(false)

const selectedRows = ref<WebsiteItem[]>([])

const sortState = ref<{ orderBy: string | null; orderDir: string | null }>({
  orderBy: null,
  orderDir: null,
})

const formData = reactive<{
  id?: number
  label: string
  url: string
  desc: string | null
  tabId: number | null
  iconType: string
  iconUrl: string | null
  iconText: string | null
  iconBgColor: string | null
  documents: DocumentLink[]
  order: number | null
}>({
  label: '',
  url: '',
  desc: null,
  tabId: null,
  iconType: '',
  iconUrl: null,
  iconText: null,
  iconBgColor: null,
  documents: [],
  order: null,
})

const iconPreviewStyle = computed(() => {
  if (formData.iconType === 'text' && formData.iconText) {
    return {
      width: '64px',
      height: '64px',
      borderRadius: '1rem',
      backgroundColor: formData.iconBgColor || '#2ecc71',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }
  }
  return null
})

const iconPreviewSrc = computed(() => {
  if (formData.iconType === 'file' && formData.iconUrl) {
    return formData.iconUrl
  }
  return null
})

async function loadData() {
  loading.value = true
  try {
    const res = await getWebsiteList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      tabId: activeTabId.value,
      label: searchLabel.value || null,
      orderBy: sortState.value.orderBy,
      orderDir: sortState.value.orderDir,
    })
    tableData.value = res.data || []
    total.value = res.total || 0
  } catch {
  } finally {
    loading.value = false
  }
}

async function loadTabOptions() {
  try {
    const res = await getTabList({ label: null })
    tabOptions.value = res.data || []
    if (tabOptions.value.length > 0 && activeTabId.value === null) {
      activeTabId.value = tabOptions.value[0].id
    }
    loadData()
  } catch {}
}

function handleTabClick(tabId: number | null) {
  activeTabId.value = tabId
  currentPage.value = 1
  loadData()
}

function handleSearch() {
  currentPage.value = 1
  loadData()
}

function handleReset() {
  searchLabel.value = ''
  currentPage.value = 1
  loadData()
}

function handleAdd() {
  if (tabOptions.value.length === 0) {
    ElMessage.warning('请先添加标签页')
    return
  }
  isEdit.value = false
  dialogTitle.value = '新增网站'
  formData.id = undefined
  formData.label = ''
  formData.url = ''
  formData.desc = null
  formData.tabId = activeTabId.value !== null ? activeTabId.value : null
  formData.iconType = ''
  formData.iconUrl = null
  formData.iconText = null
  formData.iconBgColor = null
  formData.documents = []
  formData.order = null
  dialogVisible.value = true
}

function handleEdit(row: WebsiteItem) {
  isEdit.value = true
  dialogTitle.value = '编辑网站'
  formData.id = row.id
  formData.label = row.label
  formData.url = row.url
  formData.desc = row.desc
  formData.tabId = row.tabId
  formData.order = row.order
  if (row.icon) {
    formData.iconType = row.icon.type || ''
    formData.iconUrl = row.icon.url || null
    formData.iconText = row.icon.text || null
    formData.iconBgColor = row.icon.backgroundColor || null
  } else {
    formData.iconType = ''
    formData.iconUrl = null
    formData.iconText = null
    formData.iconBgColor = null
  }
  if (row.document && Array.isArray(row.document)) {
    formData.documents = row.document.map(d => ({ title: d.title, url: d.url }))
  } else {
    formData.documents = []
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (!valid) return
    try {
      let icon: IconInfo | null | undefined = undefined
      if (formData.iconType) {
        icon = {
          type: formData.iconType,
          url: formData.iconType === 'file' ? formData.iconUrl : null,
          text: formData.iconType === 'text' ? formData.iconText : null,
          backgroundColor:
            formData.iconType === 'text' ? formData.iconBgColor : null,
        }
      }
      const documents = formData.documents.filter(d => d.title || d.url)
      if (isEdit.value) {
        const data: WebsiteUpdateRequest = {
          id: formData.id!,
          label: formData.label,
          url: formData.url,
          desc: formData.desc,
          icon,
          document: documents.length > 0 ? documents : null,
          tabId: formData.tabId,
          order: formData.order,
        }
        await updateWebsite(data)
        ElMessage.success('编辑成功')
      } else {
        const data: WebsiteCreateRequest = {
          label: formData.label,
          url: formData.url,
          desc: formData.desc,
          icon,
          document: documents.length > 0 ? documents : null,
          tabId: formData.tabId!,
          order: formData.order,
        }
        await addWebsite(data)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch {}
  })
}

async function handleDelete(row: WebsiteItem) {
  await ElMessageBox.confirm('确定删除该网站吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteWebsite(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {}
}

async function handleBatchDelete() {
  if (selectedRows.value.length === 0) return
  await ElMessageBox.confirm(
    `确定删除选中的 ${selectedRows.value.length} 个网站吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
  try {
    await Promise.all(selectedRows.value.map(row => deleteWebsite(row.id)))
    ElMessage.success('删除成功')
    loadData()
  } catch {}
}

function handleSelectionChange(rows: WebsiteItem[]) {
  selectedRows.value = rows
}

function handleSortChange({
  prop,
  order,
}: {
  prop: string
  order: string | null
}) {
  if (order) {
    sortState.value.orderBy = prop
    sortState.value.orderDir = order === 'ascending' ? 'asc' : 'desc'
  } else {
    sortState.value.orderBy = null
    sortState.value.orderDir = null
  }
  currentPage.value = 1
  loadData()
}

function addDocument() {
  formData.documents.push({ title: '', url: '' })
}

function addPresetDocument(preset: 'github' | 'doc') {
  if (preset === 'github') {
    formData.documents.push({ title: 'GitHub', url: '' })
  } else if (preset === 'doc') {
    formData.documents.push({ title: '文档地址', url: '' })
  }
}

function removeDocument(index: number) {
  formData.documents.splice(index, 1)
}

async function handleIconUpload(options: UploadRequestOptions) {
  try {
    const res = await uploadFile(options.file)
    formData.iconUrl = res.data.url
    ElMessage.success('图标上传成功')
  } catch {
    ElMessage.error('图标上传失败')
  }
}

const rules: FormRules = {
  label: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入网站地址', trigger: 'blur' }],
  tabId: [{ required: true, message: '请选择所属标签', trigger: 'change' }],
}

watch([currentPage, pageSize], () => {
  loadData()
})

onMounted(() => {
  loadTabOptions()
})
</script>

<template>
  <div class="website-view">
    <h1 class="page-title">网站管理</h1>

    <div v-if="tabOptions.length === 0" class="empty-state">
      <p>请先添加标签页</p>
      <el-button type="success" @click="router.push('/admin/tab')">
        前往标签管理
      </el-button>
    </div>

    <template v-else>
      <div class="tab-nav">
        <button
          :class="['tab-btn', { active: activeTabId === null }]"
          @click="handleTabClick(null)"
        >
          全部
        </button>
        <button
          v-for="tab in tabOptions"
          :key="tab.id"
          :class="['tab-btn', { active: activeTabId === tab.id }]"
          @click="handleTabClick(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="search-bar">
        <el-input
          v-model="searchLabel"
          placeholder="请输入网站名称"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <el-button type="success" @click="handleSearch">
          <span class="material-symbols-outlined btn-icon">search</span>
          查询
        </el-button>
        <el-button @click="handleReset">
          <span class="material-symbols-outlined btn-icon">refresh</span>
          重置
        </el-button>
      </div>

      <div class="action-bar">
        <el-button type="success" @click="handleAdd">
          <span class="material-symbols-outlined btn-icon">add</span>
          新增网站
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
          v-if="selectedRows.length > 0"
        >
          <span class="material-symbols-outlined btn-icon">delete</span>
          批量删除{{
            selectedRows.length > 0 ? `(${selectedRows.length})` : ''
          }}
        </el-button>
      </div>

      <div class="table-wrapper">
        <el-table
          :data="tableData"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          max-height="calc(100vh - 380px)"
        >
        <el-table-column type="selection" width="50" />
        <el-table-column
          type="index"
          label="序号"
          width="70"
          :index="(i: number) => (currentPage - 1) * pageSize + i + 1"
        />
        <el-table-column prop="label" label="网站名称" min-width="150" />
        <el-table-column
          prop="url"
          label="网站地址"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="desc"
          label="描述"
          min-width="200"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.desc || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" min-width="80" align="center">
          <template #default="{ row }">
            <div v-if="row.icon" class="icon-cell">
              <div
                v-if="row.icon.type === 'text' && row.icon.text"
                class="icon-text-box"
                :style="{
                  backgroundColor: row.icon.backgroundColor || '#2ecc71',
                }"
              >
                {{ row.icon.text }}
              </div>
              <div
                v-else-if="row.icon.type === 'file' && row.icon.url"
                class="icon-file-box"
              >
                <img :src="row.icon.url" class="icon-file-img" />
              </div>
              <span v-else>-</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="success" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button link type="danger" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </template>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item label="网站名称" prop="label">
          <el-input v-model="formData.label" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="formData.url" placeholder="请输入网站地址" />
        </el-form-item>
        <el-form-item label="所属标签" prop="tabId">
          <el-select v-model="formData.tabId" placeholder="请选择所属标签">
            <el-option
              v-for="tab in tabOptions"
              :key="tab.id"
              :label="tab.label"
              :value="tab.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="formData.desc as string"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="图标类型" prop="iconType">
          <el-select
            v-model="formData.iconType"
            placeholder="请选择图标类型"
            clearable
          >
            <el-option label="文件" value="file" />
            <el-option label="文字" value="text" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="formData.iconType" label="图标预览">
          <div class="icon-preview-area">
            <div v-if="iconPreviewStyle" :style="iconPreviewStyle">
              {{ formData.iconText }}
            </div>
            <div v-else-if="iconPreviewSrc" class="icon-preview-file-box">
              <img :src="iconPreviewSrc" class="icon-preview-file-img" />
            </div>
            <div v-else class="icon-preview-placeholder">暂无预览</div>
          </div>
        </el-form-item>

        <el-form-item v-if="formData.iconType === 'text'" label="图标文字">
          <el-input
            v-model="formData.iconText as string"
            placeholder="请输入图标文字"
          />
        </el-form-item>
        <el-form-item v-if="formData.iconType === 'text'" label="图标背景色">
          <el-color-picker v-model="formData.iconBgColor as string" />
        </el-form-item>
        <el-form-item v-if="formData.iconType === 'file'" label="图标文件">
          <div class="icon-upload-area">
            <el-upload
              :http-request="handleIconUpload"
              :show-file-list="false"
              accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp,image/bmp,image/x-icon"
            >
              <el-button type="success" size="small">
                <span class="material-symbols-outlined btn-icon">upload</span>
                上传图标
              </el-button>
            </el-upload>
            <span v-if="formData.iconUrl" class="upload-tip">
              已上传，点击可替换
            </span>
          </div>
        </el-form-item>

        <el-form-item label="文档链接">
          <div style="width: 100%">
            <div class="document-preset-bar">
              <el-button size="small" @click="addPresetDocument('github')">
                <span class="material-symbols-outlined btn-icon">add</span>
                GitHub 链接
              </el-button>
              <el-button size="small" @click="addPresetDocument('doc')">
                <span class="material-symbols-outlined btn-icon">add</span>
                文档地址
              </el-button>
              <el-button size="small" type="success" @click="addDocument">
                <span class="material-symbols-outlined btn-icon">add</span>
                自定义
              </el-button>
            </div>
            <div
              v-for="(_, index) in formData.documents"
              :key="index"
              class="document-item"
            >
              <el-input
                v-model="formData.documents[index].title"
                placeholder="文档标题"
              />
              <el-input
                v-model="formData.documents[index].url"
                placeholder="文档地址"
              />
              <el-button type="danger" link @click="removeDocument(index)">
                <span class="material-symbols-outlined btn-icon">remove</span>
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排序值" prop="order">
          <el-input-number
            v-model="formData.order as number"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.website-view {
  display: flex;
  flex-direction: column;
  height: 100%;

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--on-surface);
    margin-bottom: 24px;
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

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    gap: 16px;

    p {
      font-size: 1rem;
      color: var(--on-surface-variant);
    }
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

  .table-wrapper {
    flex: 1;
    min-height: 0;
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

  .icon-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-text-box {
      width: 64px;
      height: 64px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }

    .icon-file-box {
      width: 64px;
      height: 64px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-container-highest);
      border-radius: 1rem;

      .icon-file-img {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
    }
  }

  .icon-preview-area {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;

    .icon-preview-file-box {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-container-highest);
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      .icon-preview-file-img {
        width: 48px;
        height: 48px;
        object-fit: contain;
      }
    }

    .icon-preview-placeholder {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;
      border: 1px dashed var(--outline-variant, #3d4a3e);
      font-size: 12px;
      color: var(--on-surface-variant, #aaa);
    }
  }

  .icon-upload-area {
    display: flex;
    align-items: center;
    gap: 12px;

    .upload-tip {
      font-size: 12px;
      color: var(--on-surface-variant, #aaa);
    }
  }

  .document-preset-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .document-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    .el-input {
      flex: 1;
    }
  }
}
</style>
