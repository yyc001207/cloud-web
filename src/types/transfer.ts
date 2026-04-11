export interface TransferListRequest {
    date?: string | null
    pageNum?: number | null
    pageSize?: number | null
    keyword?: string | null
    status?: string | null
    orderBy?: string | null
    orderDir?: string | null
}

export interface TextTransferCreateRequest {
    content: string
    title?: string | null
}

export interface TextTransferUpdateRequest {
    id: number
    title?: string | null
}

export interface TextTransferItem {
    id: number
    content: string
    title: string | null
    createdAt: string
    updatedAt: string
}

export interface FileTransferCreateRequest {
    filename: string
    fileSize: number
    fileHash: string
    contentType: string
}

export interface FileCompleteRequest {
    fileId: number
    totalChunks: number
}

export interface FileTransferItem {
    id: number
    filename: string
    fileSize: number
    fileHash: string
    contentType: string
    status: string
    createdAt: string
    updatedAt: string
}

export interface FileDownloadRequest {
    fileId: number
}

export interface TransferListResponse<T> {
    code: number
    msg: string
    data: T[]
    total: number
}

export interface TransferActionResponse {
    code: number
    msg: string
    data: unknown
}
