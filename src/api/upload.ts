import { service } from '../utils/request'
import type { UploadResponse } from '../types/upload'

export function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return service.post('/api/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }) as Promise<UploadResponse>
}
