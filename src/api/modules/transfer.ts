import request from '../request'
import type {
  TextTransfer,
  TextTransferCreateRequest,
  TextTransferUpdateRequest,
  FileTransfer,
  FileTransferCreateRequest,
  FileCompleteRequest,
  TransferListRequest,
  TextTransferListResponse,
  FileTransferListResponse,
  FileChunkUploadParams,
} from '../../types/api'

// 中转站模块 API
export const transferApi = {
  // 文本中转
  text: {
    // 获取文本列表
    list(data: TransferListRequest) {
      return request.post<TextTransferListResponse>('/transfer/text/list', data)
    },

    // 创建文本
    create(data: TextTransferCreateRequest) {
      return request.post<TextTransfer>('/transfer/text/add', data)
    },

    // 更新文本
    update(data: TextTransferUpdateRequest) {
      return request.post<TextTransfer>('/transfer/text/update', data)
    },

    // 删除文本
    delete(id: number) {
      return request.post<void>('/transfer/text/delete', null, { params: { id } })
    },
  },

  // 文件中转
  file: {
    // 获取文件列表
    list(data: TransferListRequest) {
      return request.post<FileTransferListResponse>('/transfer/file/list', data)
    },

    // 创建文件上传任务
    create(data: FileTransferCreateRequest) {
      return request.post<FileTransfer>('/transfer/file/create', data)
    },

    // 上传文件分片
    uploadChunk(params: FileChunkUploadParams) {
      const formData = new FormData()
      if (params.fileId !== undefined) {
        formData.append('fileId', params.fileId.toString())
      }
      if (params.chunkIndex !== undefined) {
        formData.append('chunkIndex', params.chunkIndex.toString())
      }
      if (params.chunk) {
        formData.append('chunk', params.chunk)
      }
      
      return request.post<void>('/transfer/file/chunk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          fileId: params.fileId,
          chunkIndex: params.chunkIndex,
        },
      })
    },

    // 完成文件上传
    complete(data: FileCompleteRequest) {
      return request.post<FileTransfer>('/transfer/file/complete', data)
    },

    // 删除文件
    delete(id: number) {
      return request.post<void>('/transfer/file/delete', null, { params: { id } })
    },
  },
}
