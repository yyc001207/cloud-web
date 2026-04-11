import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
    baseURL: '',
})

let isRedirecting = false

service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

service.interceptors.response.use(
    (response) => {
        const { code, msg } = response.data
        if (code === 200) {
            return response.data
        }
        if (code === 401) {
            if (!isRedirecting) {
                isRedirecting = true
                localStorage.removeItem('token')
                ElMessage.error('登录已过期，请重新登录')
                window.location.href = '/login'
            }
            return Promise.reject(response.data)
        }
        ElMessage.error(msg)
        return Promise.reject(response.data)
    },
    (error) => {
        if (!error.response) {
            ElMessage.error('网络连接异常，请检查网络')
        }
        return Promise.reject(error)
    },
)

const request = {
    post<T = unknown>(url: string, data?: unknown) {
        return service.post(url, data) as Promise<T>
    },
    get<T = unknown>(url: string) {
        return service.get(url) as Promise<T>
    },
    put<T = unknown>(url: string, data?: unknown) {
        return service.put(url, data) as Promise<T>
    },
    delete<T = unknown>(url: string) {
        return service.delete(url) as Promise<T>
    },
}

export { service }
export default request
