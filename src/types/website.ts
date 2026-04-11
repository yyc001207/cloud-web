export interface IconInfo {
    type: string
    url?: string | null
    text?: string | null
    backgroundColor?: string | null
}

export interface DocumentLink {
    title: string
    url: string
}

export interface WebsiteItem {
    id: number
    label: string
    url: string
    desc: string | null
    icon: IconInfo | null
    document: DocumentLink[] | null
    tabId: number
    order: number | null
    createdAt: string
    updatedAt: string
}

export interface WebsiteListRequest {
    tabId?: number | null
    label?: string | null
    pageNum?: number | null
    pageSize?: number | null
    orderBy?: string | null
    orderDir?: string | null
}

export interface WebsiteCreateRequest {
    label: string
    url: string
    desc?: string | null
    icon?: IconInfo | null
    document?: DocumentLink[] | null
    tabId: number
    order?: number | null
}

export interface WebsiteUpdateRequest {
    id: number
    label?: string | null
    url?: string | null
    desc?: string | null
    icon?: IconInfo | null
    document?: DocumentLink[] | null
    tabId?: number | null
    order?: number | null
}

export interface WebsiteOrderRequest {
    tabId: number
    websiteIds: number[]
}

export interface WebsiteListResponse {
    code: number
    msg: string
    data: WebsiteItem[]
    total: number
}

export interface WebsiteActionResponse {
    code: number
    msg: string
    data: null
}
