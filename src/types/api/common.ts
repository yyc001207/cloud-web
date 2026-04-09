// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// 分页响应数据
export interface PaginationData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// HTTP 验证错误
export interface HTTPValidationError {
  detail: ValidationError[]
}

// 验证错误详情
export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

// 通用列表请求
export interface ListRequest {
  page?: number
  pageSize?: number
  keyword?: string
}

// 通用删除请求
export interface DeleteRequest {
  id: number
}
