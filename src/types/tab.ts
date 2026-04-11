export interface TabItem {
    id: number
    label: string
    desc: string | null
    order: number | null
}

export interface TabListRequest {
    pageNum?: number | null
    pageSize?: number | null
    label?: string | null
    orderBy?: string | null
    orderDir?: string | null
}

export interface TabCreateRequest {
    label: string
    desc?: string | null
    order?: number | null
}

export interface TabUpdateRequest {
    id: number
    label?: string | null
    desc?: string | null
    order?: number | null
}

export interface TabListResponse {
    code: number
    msg: string
    data: TabItem[]
    total: number
}

export interface TabActionResponse {
    code: number
    msg: string
    data: null
}
