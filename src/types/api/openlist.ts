// OpenList 全局配置
export interface OpenListGlobalConfig {
  id: number
  key: string
  value: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

// OpenList 任务配置
export interface OpenListTaskConfig {
  id: number
  name: string
  sourcePath: string
  targetPath: string
  schedule?: string
  isEnabled: boolean
  createdAt?: string
  updatedAt?: string
}

// 创建全局配置请求
export interface OpenListGlobalConfigCreateRequest {
  key: string
  value: string
  description?: string
}

// 更新全局配置请求
export interface OpenListGlobalConfigUpdateRequest {
  id: number
  key?: string
  value?: string
  description?: string
}

// 删除全局配置请求
export interface OpenListGlobalConfigDeleteRequest {
  id: number
}

// 创建任务配置请求
export interface OpenListTaskConfigCreateRequest {
  name: string
  sourcePath: string
  targetPath: string
  schedule?: string
  isEnabled?: boolean
}

// 更新任务配置请求
export interface OpenListTaskConfigUpdateRequest {
  id: number
  name?: string
  sourcePath?: string
  targetPath?: string
  schedule?: string
  isEnabled?: boolean
}

// 删除任务配置请求
export interface OpenListTaskConfigDeleteRequest {
  id: number
}

// 全局配置列表响应
export interface OpenListGlobalConfigListResponse {
  configs: OpenListGlobalConfig[]
}

// 任务配置列表响应
export interface OpenListTaskConfigListResponse {
  configs: OpenListTaskConfig[]
}
