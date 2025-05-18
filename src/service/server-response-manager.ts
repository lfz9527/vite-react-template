import axios, {
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// request 请求拦截
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!navigator.onLine) {
      console.log('网络连接已断开，请稍后重试')
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// response 响应拦截
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code === 200) {
      return response
    }
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
