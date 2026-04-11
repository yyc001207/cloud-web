export interface UploadResponseOptions {
    filename: string
    size: number
    url: string
}

export interface UploadResponse {
    code: number
    msg: string
    data: UploadResponseOptions
}