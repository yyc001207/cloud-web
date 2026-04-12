import request from '../utils/request'
import { service } from '../utils/request'
import type {
    TransferListRequest,
    TextTransferCreateRequest,
    TextTransferUpdateRequest,
    TextTransferItem,
    FileTransferCreateRequest,
    FileCompleteRequest,
    FileDownloadRequest,
    FileTransferItem,
    TransferListResponse,
    TransferActionResponse,
} from '../types/transfer'

export function getTextList(data?: TransferListRequest) {
    return request.post<TransferListResponse<TextTransferItem>>('/api/transfer/text/list', data)
}

export function addText(data: TextTransferCreateRequest) {
    return request.post<TransferActionResponse>('/api/transfer/text/add', data)
}

export function updateText(data: TextTransferUpdateRequest) {
    return request.post<TransferActionResponse>('/api/transfer/text/update', data)
}

export function deleteText(id: number) {
    return request.post<TransferActionResponse>(`/api/transfer/text/delete?id=${id}`)
}

export function getFileList(data?: TransferListRequest) {
    return request.post<TransferListResponse<FileTransferItem>>('/api/transfer/file/list', data)
}

export function createFile(data: FileTransferCreateRequest) {
    return request.post<TransferActionResponse>('/api/transfer/file/create', data)
}

export function uploadChunk(fileId: number, chunkIndex: number, chunk: Blob) {
    const formData = new FormData()
    formData.append('chunk', chunk)
    return service.post(`/api/transfer/file/chunk?fileId=${fileId}&chunkIndex=${chunkIndex}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
    })
}

export function completeFile(data: FileCompleteRequest) {
    return request.post<TransferActionResponse>('/api/transfer/file/complete', data)
}

export function deleteFile(id: number) {
    return request.post<TransferActionResponse>(`/api/transfer/file/delete?id=${id}`)
}

export function downloadFile(data: FileDownloadRequest) {
    return service.post('/api/transfer/file/download', data, {
        responseType: 'blob',
    })
}

export function directUploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', file.name)
    formData.append('fileSize', String(file.size))
    formData.append('contentType', file.type || 'application/octet-stream')
    return service.post('/api/transfer/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export function updateFileStatus(id: number, status: string) {
    return request.post<TransferActionResponse>('/api/transfer/file/update', { id, status })
}
