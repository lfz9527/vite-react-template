// axios 请求类

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'

// 常见系统错误码映射
const codeMsgMap: Record<number, string> = {
  404: '请求的资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
}

// 默认错误信息
const defaultCodeMsg = '请求失败，请稍后重试'

/**
 * axios请求类
 */
class AxiosRequest {
  public instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: '',
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    })
    this.RequestInterceptor()
    this.ResponseInterceptor()
  }
  // 请求拦截器
  private RequestInterceptor() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        try {
          this.setToken(config)
          return config
        } catch (error) {
          return Promise.reject(error)
        }
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  // 响应拦截器
  private ResponseInterceptor() {
    this.instance.interceptors.response.use(
      <T>(response: AxiosResponse<API.ResponseData<T>>) => {
        const { status, data } = response
        try {
          if (status === 200) {
            this.handleBusinessError(data)
            return response
          } else {
            throw new Error(codeMsgMap[status] || defaultCodeMsg)
          }
        } catch (error) {
          return Promise.reject(error)
        }
      },
      (error: AxiosError) => {
        const { status } = error
        const systemErrorMessage = status ? codeMsgMap[status] : defaultCodeMsg
        return Promise.reject(new Error(systemErrorMessage))
      }
    )
  }

  /**
   * 设置请求token
   * @param config axios请求配置
   */
  private setToken(config: InternalAxiosRequestConfig): void {
    // 根据业务需求，获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
  }

  /**
   * 针对业务进行自定义相应处理
   * @param response 响应数据
   * @param data
   * @returns
   */
  private handleBusinessError<T>(data: API.ResponseData<T>) {
    // @TODO 针对业务进行自定义相应处理
    const { code, message } = data
    if (code === 10000) {
      return data
    } else {
      throw new Error(message || defaultCodeMsg)
    }
  }
}
export const axiosRequest = new AxiosRequest()
