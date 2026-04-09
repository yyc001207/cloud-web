import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 获取 token
    const token = localStorage.getItem('token')
    
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params)
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data)
    }
    
    // 直接返回响应数据
    return response.data
  },
  (error: AxiosError) => {
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response
      const message = (data as any)?.message || error.message
      
      switch (status) {
        case 401:
          console.error('[API Error 401] 未授权，请重新登录')
          // 清除 token 并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('[API Error 403] 禁止访问:', message)
          break
        case 404:
          console.error('[API Error 404] 资源不存在:', message)
          break
        case 422:
          console.error('[API Error 422] 参数验证失败:', message)
          break
        case 500:
          console.error('[API Error 500] 服务器内部错误:', message)
          break
        default:
          console.error(`[API Error ${status}]`, message)
      }
    } else if (error.request) {
      console.error('[API Error] 网络请求失败，请检查网络连接')
    } else {
      console.error('[API Error]', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default request
