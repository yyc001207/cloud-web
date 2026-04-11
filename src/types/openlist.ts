export interface OpenListGlobalConfigItem {
    id: number
    userId: number
    baseUrl: string
    tokenMasked: string
    videoExtensions: string[] | null
    subtitleExtensions: string[] | null
    createdAt: string
    updatedAt: string
}

export interface OpenListGlobalConfigCreateRequest {
    baseUrl: string
    token: string
    videoExtensions?: string[] | null
    subtitleExtensions?: string[] | null
}

export interface OpenListGlobalConfigUpdateRequest {
    baseUrl?: string | null
    token?: string | null
    videoExtensions?: string[] | null
    subtitleExtensions?: string[] | null
}

export interface OpenListGlobalConfigResponse {
    code: number
    msg: string
    data: OpenListGlobalConfigItem | null
}

export interface OpenListTaskConfigItem {
    id: number
    name: string
    outputDir: string | null
    taskPaths: string
    maxScanDepth: number | null
    createdAt: string
    updatedAt: string
}

export interface OpenListTaskConfigCreateRequest {
    name: string
    taskPaths: string
    outputDir?: string | null
    maxScanDepth?: number | null
}

export interface OpenListTaskConfigUpdateRequest {
    name?: string | null
    outputDir?: string | null
    taskPaths?: string | null
    maxScanDepth?: number | null
}

export interface TaskConfigListRequest {
    pageNum?: number | null
    pageSize?: number | null
    name?: string | null
    orderBy?: string | null
    orderDir?: string | null
}

export interface OpenListExecuteRequest {
    globalConfigId: number
    taskConfigId: number
    incrementalMode?: boolean
    force?: boolean
}

export interface TaskHistoryRequest {
    taskConfigId: number
}

export interface RunningTaskItem {
    taskId: string
    taskConfigId: number
    taskConfigName: string
    status: string
    startTime: string
    endTime: string | null
    progress: number | null
    totalFiles: number | null
    processedFiles: number | null
    failedFiles: number | null
}

export interface TaskResultItem {
    taskId: string
    taskConfigId: number
    taskConfigName: string
    status: string
    startTime: string
    endTime: string | null
    totalFiles: number | null
    processedFiles: number | null
    failedFiles: number | null
    totalVideos: number | null
    successVideos: number | null
    successSubtitles: number | null
    failedSubtitles: number | null
}

export interface OpenListListResponse<T> {
    code: number
    msg: string
    data: T[]
    total: number
}

export interface OpenListActionResponse {
    code: number
    msg: string
    data: unknown
}

export interface TaskHistoryDetailResponse {
    code: number
    msg: string
    data: TaskResultItem
}

export interface LatestResultItem {
    taskConfigId: number
    taskName: string
    executionStatus: string
    executionInfo: string
    executionTime: string
}

export interface TaskHistoryLatestDetail {
    executionStatus: string
    totalVideos: number
    successVideos: number
    successSubtitles: number
    errorSubtitles: number
    executionTime: string
}

export interface TaskHistoryListItem {
    executionStatus: string
    executionInfo: string
    executionTime: string
}

export interface TaskHistoryData {
    taskConfigId: number
    taskName: string
    latestDetail: TaskHistoryLatestDetail
    historyList: TaskHistoryListItem[]
}

export interface TaskHistoryResponse {
    code: number
    msg: string
    data: TaskHistoryData
}

export interface LatestResultsResponse {
    code: number
    msg: string
    data: LatestResultItem[]
}
