// 文本中转
export interface TextTransfer {
  id: number
  content: string
  title?: string
  expireAt?: string
  createdAt?: string
}

// 文件中转
export interface FileTransfer {
  id: number
  filename: string
  url: string
  size: number
  mimeType: string
  expireAt?: string
  createdAt?: string
}

// 创建文本中转请求
export interface TextTransferCreateRequest {
  content: string
  title?: string
}

// 更新文本中转请求
export interface TextTransferUpdateRequest {
  id: number
  title?: string
}

// 删除文本中转请求
export interface TextTransferDeleteRequest {
  id: number
}

// 创建文件中转请求
export interface FileTransferCreateRequest {
  filename: string
  size: number
  mimeType: string
  totalChunks: number
}

// 完成文件上传请求
export interface FileCompleteRequest {
  fileId: number
  chunkIds: number[]
}

// 删除文件中转请求
export interface FileTransferDeleteRequest {
  id: number
}

// 列表请求
export interface TransferListRequest {
  date?: string
  pageNum?: number
  pageSize?: number
}

// 文本中转列表响应
export interface TextTransferListResponse {
  transfers: TextTransfer[]
  total: number
}

// 文件中转列表响应
export interface FileTransferListResponse {
  transfers: FileTransfer[]
  total: number
}

// 文件分片上传参数
export interface FileChunkUploadParams {
  fileId?: number
  chunkIndex?: number
  chunk?: Blob
}
