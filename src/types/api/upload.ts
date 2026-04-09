// 单文件上传请求
export interface FileUploadRequest {
  file: File
}

// 多文件上传请求
export interface FilesUploadRequest {
  files: File[]
}

// 上传响应
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

// 多文件上传响应
export interface FilesUploadResponse {
  files: FileUploadResponse[]
}

// 文件上传请求体（用于 multipart/form-data）
export interface BodyUploadSingleFile {
  file: File
}

// 多文件上传请求体
export interface BodyUploadMultipleFiles {
  files: File[]
}
