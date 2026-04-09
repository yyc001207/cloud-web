<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import AdminLayout from '../../components/AdminLayout.vue'

// 图标类型
type IconType = 'emoji' | 'icon' | 'url'

// 菜单项接口
interface MenuItem {
  id: number
  label: string
  path: string
  icon: { type: IconType; value: string }
  order: number
  isShow: boolean
  createdAt: string
}

// 菜单数据（假数据）
const menuList = ref<MenuItem[]>([
  {
    id: 1,
    label: '首页',
    path: '/home',
    icon: { type: 'icon', value: 'home' },
    order: 1,
    isShow: true,
    createdAt: '2026-01-01 10:00:00'
  },
  {
    id: 2,
    label: '系统管理',
    path: '/admin',
    icon: { type: 'icon', value: 'settings' },
    order: 2,
    isShow: true,
    createdAt: '2026-01-02 10:00:00'
  },
  {
    id: 3,
    label: '用户管理',
    path: '/admin/users',
    icon: { type: 'icon', value: 'group' },
    order: 3,
    isShow: true,
    createdAt: '2026-01-03 10:00:00'
  },
  {
    id: 4,
    label: '菜单管理',
    path: '/admin/menus',
    icon: { type: 'icon', value: 'menu' },
    order: 4,
    isShow: true,
    createdAt: '2026-01-04 10:00:00'
  }
])

// 对话框显示状态
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  id: 0,
  label: '',
  path: '',
  iconType: 'icon' as 'emoji' | 'icon' | 'url',
  iconValue: '',
  order: 1,
  isShow: true
})

// 表单验证规则
const rules: FormRules = {
  label: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
  iconValue: [{ required: true, message: '请输入图标', trigger: 'blur' }]
}

// 打开新增对话框
function handleAdd() {
  isEdit.value = false
  form.id = 0
  form.label = ''
  form.path = ''
  form.iconType = 'icon'
  form.iconValue = ''
  form.order = menuList.value.length + 1
  form.isShow = true
  dialogVisible.value = true
}

// 打开编辑对话框
function handleEdit(row: any) {
  isEdit.value = true
  form.id = row.id
  form.label = row.label
  form.path = row.path
  form.iconType = row.icon.type
  form.iconValue = row.icon.value
  form.order = row.order
  form.isShow = row.isShow
  dialogVisible.value = true
}

// 删除菜单
async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单 "${row.label}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const index = menuList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      menuList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑
        const index = menuList.value.findIndex(item => item.id === form.id)
        if (index > -1) {
          menuList.value[index] = {
            ...menuList.value[index],
            label: form.label,
            path: form.path,
            icon: { type: form.iconType, value: form.iconValue },
            order: form.order,
            isShow: form.isShow
          }
        }
        ElMessage.success('修改成功')
      } else {
        // 新增
        const newMenu = {
          id: Date.now(),
          label: form.label,
          path: form.path,
          icon: { type: form.iconType, value: form.iconValue },
          order: form.order,
          isShow: form.isShow,
          createdAt: new Date().toLocaleString('zh-CN')
        }
        menuList.value.push(newMenu)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<template>
  <AdminLayout>
    <div class="menu-view">
      <!-- 操作栏 -->
      <div class="operation-bar">
        <button class="add-btn" @click="handleAdd">
          <span class="material-symbols-outlined">add</span>
          新增菜单
        </button>
      </div>

      <!-- 表格 -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>菜单名称</th>
              <th>路径</th>
              <th>图标</th>
              <th>排序</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in menuList" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.label }}</td>
              <td>{{ row.path }}</td>
              <td>
                <span class="material-symbols-outlined table-icon">{{ row.icon.value }}</span>
              </td>
              <td>{{ row.order }}</td>
              <td>
                <span :class="['status-badge', row.isShow ? 'active' : 'inactive']">
                  {{ row.isShow ? '显示' : '隐藏' }}
                </span>
              </td>
              <td>{{ row.createdAt }}</td>
              <td>
                <div class="action-btns">
                  <button class="action-btn edit" @click="handleEdit(row)">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="action-btn delete" @click="handleDelete(row)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑菜单' : '新增菜单'"
        width="500px"
        class="custom-dialog"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
          class="menu-form"
        >
          <el-form-item label="菜单名称" prop="label">
            <el-input v-model="form.label" placeholder="请输入菜单名称" />
          </el-form-item>
          
          <el-form-item label="路径" prop="path">
            <el-input v-model="form.path" placeholder="请输入菜单路径，如 /home" />
          </el-form-item>
          
          <el-form-item label="图标类型">
            <el-radio-group v-model="form.iconType">
              <el-radio label="emoji">Emoji</el-radio>
              <el-radio label="icon">图标</el-radio>
              <el-radio label="url">URL</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="图标" prop="iconValue">
            <el-input v-model="form.iconValue" placeholder="请输入图标值" />
          </el-form-item>
          
          <el-form-item label="排序">
            <el-input-number v-model="form.order" :min="1" />
          </el-form-item>
          
          <el-form-item label="显示状态">
            <el-switch v-model="form.isShow" />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </AdminLayout>
</template>

<style scoped lang="scss">
.menu-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 操作栏
.operation-bar {
  display: flex;
  justify-content: flex-end;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
}

// 表格容器
.table-container {
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(61, 74, 62, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid rgba(61, 74, 62, 0.05);
  }

  th {
    background: var(--surface-container-low);
    font-weight: 600;
    color: var(--on-surface);
    font-size: 0.875rem;
  }

  td {
    color: var(--on-surface-variant);
    font-size: 0.875rem;
  }

  tbody tr:hover {
    background: rgba(111, 230, 146, 0.02);
  }
}

.table-icon {
  font-size: 20px;
  color: var(--primary);
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;

  &.active {
    background: rgba(111, 230, 146, 0.1);
    color: var(--primary);
  }

  &.inactive {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
  }
}

.action-btns {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.edit {
    background: rgba(33, 150, 243, 0.1);
    color: #2196f3;

    &:hover {
      background: rgba(33, 150, 243, 0.2);
    }
  }

  &.delete {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;

    &:hover {
      background: rgba(244, 67, 54, 0.2);
    }
  }

  .material-symbols-outlined {
    font-size: 18px;
  }
}

// 表单样式
.menu-form {
  :deep(.el-form-item__label) {
    color: var(--on-surface);
  }

  :deep(.el-input__wrapper) {
    background: var(--surface-container-low);
    box-shadow: none;
    border: 1px solid rgba(61, 74, 62, 0.1);

    &.is-focus {
      border-color: var(--primary);
    }
  }

  :deep(.el-input__inner) {
    color: var(--on-surface);
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
