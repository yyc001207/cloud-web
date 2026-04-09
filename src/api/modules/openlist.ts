import request from '../request'
import type {
  OpenListGlobalConfig,
  OpenListGlobalConfigCreateRequest,
  OpenListGlobalConfigUpdateRequest,
  OpenListTaskConfig,
  OpenListTaskConfigCreateRequest,
  OpenListTaskConfigUpdateRequest,
  OpenListGlobalConfigListResponse,
  OpenListTaskConfigListResponse,
} from '../../types/api'

// OpenList STRM 模块 API
export const openlistApi = {
  // 全局配置
  globalConfig: {
    // 获取全局配置列表
    list() {
      return request.post<OpenListGlobalConfigListResponse>('/openlist/global-config')
    },

    // 创建全局配置
    create(data: OpenListGlobalConfigCreateRequest) {
      return request.post<OpenListGlobalConfig>('/openlist/global-config/add', data)
    },

    // 更新全局配置
    update(data: OpenListGlobalConfigUpdateRequest) {
      return request.post<OpenListGlobalConfig>('/openlist/global-config/update', data)
    },

    // 删除全局配置
    delete(id: number) {
      return request.post<void>('/openlist/global-config/delete', null, { params: { id } })
    },
  },

  // 任务配置
  taskConfig: {
    // 获取任务配置列表
    list() {
      return request.post<OpenListTaskConfigListResponse>('/openlist/task-config/list')
    },

    // 创建任务配置
    create(data: OpenListTaskConfigCreateRequest) {
      return request.post<OpenListTaskConfig>('/openlist/task-config/add', data)
    },

    // 更新任务配置
    update(data: OpenListTaskConfigUpdateRequest) {
      return request.post<OpenListTaskConfig>('/openlist/task-config/update', data)
    },

    // 删除任务配置
    delete(id: number) {
      return request.post<void>('/openlist/task-config/delete', null, { params: { id } })
    },
  },
}
