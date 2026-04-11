<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getHolidayList, addHoliday, deleteHoliday } from '../../api/holiday'
import type { HolidayItem, HolidayCreateRequest } from '../../types/holiday'

const tableData = ref<HolidayItem[]>([])
const loading = ref(false)
const searchYear = ref('')

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('新增节假日')
const formRef = ref<FormInstance>()
const formData = reactive<{ year: number | null }>({
  year: null,
})

const selectedRows = ref<HolidayItem[]>([])

const submitLoading = ref(false)

async function loadData() {
  loading.value = true
  try {
    const res = await getHolidayList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      year: searchYear.value || null,
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
  searchYear.value = ''
  currentPage.value = 1
  loadData()
}

function handleAdd() {
  dialogTitle.value = '新增节假日'
  formData.year = null
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (!valid) return
    submitLoading.value = true
    try {
      const data: HolidayCreateRequest = {
        year: formData.year!,
      }
      await addHoliday(data)
      ElMessage.success('新增成功')
      dialogVisible.value = false
      loadData()
    } catch {
    } finally {
      submitLoading.value = false
    }
  })
}

async function handleDelete(row: HolidayItem) {
  await ElMessageBox.confirm('确定删除该节假日数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteHoliday(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {}
}

async function handleBatchDelete() {
  if (selectedRows.value.length === 0) return
  await ElMessageBox.confirm(
    `确定删除选中的 ${selectedRows.value.length} 个节假日吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
  try {
    await Promise.all(selectedRows.value.map(row => deleteHoliday(row.id)))
    ElMessage.success('删除成功')
    loadData()
  } catch {}
}

function handleSelectionChange(rows: HolidayItem[]) {
  selectedRows.value = rows
}

const rules: FormRules = {
  year: [{ required: true, message: '请输入年份', trigger: 'blur' }],
}

watch([currentPage, pageSize], () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="holiday-view">
    <h1 class="page-title">节假日管理</h1>

    <div class="search-bar">
      <el-input
        v-model="searchYear"
        placeholder="请输入年份"
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
        新增节假日
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

    <el-table
      :data="tableData"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column
        type="index"
        label="序号"
        width="70"
        :index="(i: number) => (currentPage - 1) * pageSize + i + 1"
      />
      <el-table-column prop="year" label="年份" min-width="20" />
      <el-table-column prop="holiday" label="节假日" min-width="150">
        <template #default="{ row }">
          <div class="tag-container">
            <el-tag
              v-for="(date, index) in row.holiday.split(',')"
              :key="index"
              type="danger"
              size="small"
              class="date-tag"
            >
              {{ date }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="adjustment" label="上班日期" min-width="150">
        <template #default="{ row }">
          <div class="tag-container">
            <el-tag
              v-for="(date, index) in row.adjustment.split(',')"
              :key="index"
              type="warning"
              size="small"
              class="date-tag"
            >
              {{ date }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="danger" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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
        <el-form-item label="年份" prop="year">
          <el-input-number
            v-model="formData.year as number"
            :min="2000"
            :max="2100"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.holiday-view {
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

    .search-input {
      width: 240px;
    }
  }

  .action-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
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
  }

  .date-tag {
    margin: 2px 4px;
  }

  .tag-container {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
