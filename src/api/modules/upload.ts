import request from '../request'
import type {
  FileUploadResponse,
  FilesUploadResponse,
} from '../../types/api'

// 文件上传模块 API
export const uploadApi = {
  // 单文件上传
  uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    return request.post<FileUploadResponse>('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 多文件上传
  uploadFiles(files: File[]) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    return request.post<FilesUploadResponse>('/upload/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
