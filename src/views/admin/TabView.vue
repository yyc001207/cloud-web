<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getTabList, addTab, updateTab, deleteTab } from '../../api/tab'
import type {
  TabItem,
  TabCreateRequest,
  TabUpdateRequest,
} from '../../types/tab'

const tableData = ref<TabItem[]>([])
const loading = ref(false)
const searchLabel = ref('')

const currentPage = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const dialogTitle = ref('新增标签')
const formRef = ref<FormInstance>()
const formData = reactive<TabCreateRequest & { id?: number }>({
  label: '',
  desc: null,
  order: null,
})
const isEdit = ref(false)

const selectedRows = ref<TabItem[]>([])

const sortState = ref<{ orderBy: string | null; orderDir: string | null }>({
  orderBy: null,
  orderDir: null,
})

const total = ref(0)

async function loadData() {
  loading.value = true
  try {
    const res = await getTabList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
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
  isEdit.value = false
  dialogTitle.value = '新增标签'
  formData.id = undefined
  formData.label = ''
  formData.desc = null
  formData.order = null
  dialogVisible.value = true
}

function handleEdit(row: TabItem) {
  isEdit.value = true
  dialogTitle.value = '编辑标签'
  formData.id = row.id
  formData.label = row.label
  formData.desc = row.desc
  formData.order = row.order
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (!valid) return
    try {
      if (isEdit.value) {
        const data: TabUpdateRequest = {
          id: formData.id!,
          label: formData.label,
          desc: formData.desc,
          order: formData.order,
        }
        await updateTab(data)
        ElMessage.success('编辑成功')
      } else {
        const data: TabCreateRequest = {
          label: formData.label,
          desc: formData.desc,
          order: formData.order,
        }
        await addTab(data)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch {}
  })
}

async function handleDelete(row: TabItem) {
  await ElMessageBox.confirm('确定删除该标签吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteTab(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {}
}

async function handleBatchDelete() {
  if (selectedRows.value.length === 0) return
  await ElMessageBox.confirm(
    `确定删除选中的 ${selectedRows.value.length} 个标签吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
  try {
    await Promise.all(selectedRows.value.map(row => deleteTab(row.id)))
    ElMessage.success('删除成功')
    loadData()
  } catch {}
}

function handleSelectionChange(rows: TabItem[]) {
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

const rules: FormRules = {
  label: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
}

watch([currentPage, pageSize], () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="tab-view">
    <h1 class="page-title">标签页管理</h1>

    <div class="search-bar">
      <el-input
        v-model="searchLabel"
        placeholder="请输入标签名称"
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
        新增标签
      </el-button>
      <el-button
        type="danger"
        :disabled="selectedRows.length === 0"
        @click="handleBatchDelete"
        v-if="selectedRows.length > 0"
      >
        <span class="material-symbols-outlined btn-icon">delete</span>
        批量删除{{ selectedRows.length > 0 ? `(${selectedRows.length})` : '' }}
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
      <el-table-column prop="label" label="标签名称" min-width="150" />
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
      <el-table-column
        prop="order"
        label="排序值"
        width="100"
        sortable="custom"
      >
        <template #default="{ row }">
          {{ row.order ?? '-' }}
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="label">
          <el-input v-model="formData.label" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="formData.desc as string"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
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
.tab-view {
  display: flex;
  flex-direction: column;
  height: 100%;

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--on-surface);
    margin-bottom: 24px;
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

  .table-wrapper {
    flex: 1;
    min-height: 0;
  }
}
</style>
