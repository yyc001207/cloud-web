import request from '../utils/request'
import type {
    OpenListGlobalConfigCreateRequest,
    OpenListGlobalConfigUpdateRequest,
    OpenListGlobalConfigResponse,
    OpenListTaskConfigItem,
    OpenListTaskConfigCreateRequest,
    OpenListTaskConfigUpdateRequest,
    TaskConfigListRequest,
    OpenListExecuteRequest,
    TaskHistoryRequest,
    RunningTaskItem,
    OpenListListResponse,
    OpenListActionResponse,
    TaskHistoryDetailResponse,
    TaskHistoryResponse,
    LatestResultsResponse,
} from '../types/openlist'

export function getGlobalConfig() {
    return request.post<OpenListGlobalConfigResponse>('/api/openlist/global-config')
}

export function addGlobalConfig(data: OpenListGlobalConfigCreateRequest) {
    return request.post<OpenListActionResponse>('/api/openlist/global-config/add', data)
}

export function updateGlobalConfig(id: number, data: OpenListGlobalConfigUpdateRequest) {
    return request.post<OpenListActionResponse>(`/api/openlist/global-config/update?id=${id}`, data)
}

export function deleteGlobalConfig(id: number) {
    return request.post<OpenListActionResponse>(`/api/openlist/global-config/delete?id=${id}`)
}

export function getTaskConfigList(data?: TaskConfigListRequest) {
    return request.post<OpenListListResponse<OpenListTaskConfigItem>>('/api/openlist/task-config/list', data)
}

export function addTaskConfig(data: OpenListTaskConfigCreateRequest) {
    return request.post<OpenListActionResponse>('/api/openlist/task-config/add', data)
}

export function updateTaskConfig(id: number, data: OpenListTaskConfigUpdateRequest) {
    return request.post<OpenListActionResponse>(`/api/openlist/task-config/update?id=${id}`, data)
}

export function deleteTaskConfig(id: number) {
    return request.post<OpenListActionResponse>(`/api/openlist/task-config/delete?id=${id}`)
}

export function executeTask(data: OpenListExecuteRequest) {
    return request.post<OpenListActionResponse>('/api/openlist/execute', data)
}

export function cancelTask(taskId: string) {
    return request.post<OpenListActionResponse>(`/api/openlist/cancel?taskId=${taskId}`)
}

export function getRunningTasks() {
    return request.post<OpenListListResponse<RunningTaskItem>>('/api/openlist/tasks/running')
}

export function getLatestResults() {
    return request.post<LatestResultsResponse>('/api/openlist/task/latest-results')
}

export function getTaskHistory(data: TaskHistoryRequest) {
    return request.post<TaskHistoryResponse>('/api/openlist/task/history', data)
}

export function getTaskHistoryDetail(taskConfigId: number) {
    return request.post<TaskHistoryDetailResponse>('/api/openlist/task/history/detail', { taskConfigId })
}
