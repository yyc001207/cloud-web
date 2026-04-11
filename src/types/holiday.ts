export interface HolidayItem {
    id: number
    year: number
    holiday: string[]
    adjustment: string[]
}

export interface HolidayCreateRequest {
    year: number
}

export interface HolidayListResponse {
    code: number
    msg: string
    data: HolidayItem[]
    total: number
}

export interface HolidayActionResponse {
    code: number
    msg: string
    data: null
}
