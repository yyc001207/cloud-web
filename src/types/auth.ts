export interface LoginRequest {
    userName: string
    password: string
}

export interface LoginResponse {
    code: number
    msg: string
    token: string
}

export type LogoutRequest = Record<string, never>

export interface UserInfo {
    id: number
    userName: string
    isActive: boolean
}

export interface UserInfoResponse {
    code: number
    msg: string
    data: UserInfo
}

export interface ApiResponse<T> {
    code: number
    msg: string
    data: T
}
