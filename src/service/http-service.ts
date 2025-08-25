import { http } from './http-base'
import type {
  AxiosRequestConfig,
  Method,
  ErrorCallback,
  ResponseData,
  RequestKey,
  RetryConfig,
} from './type'

interface OptionsType extends AxiosRequestConfig {
  method?: Method
  ErrorCallback?: ErrorCallback
  requestKey?: RequestKey
  retry?: RetryConfig
}

class HttpService {
  /**
   * 错误处理
   * @param error 错误
   * @param errorCallback 针对性的错误回调
   */
  errorHandler(errorData: ResponseData, errorCallback?: ErrorCallback) {
    console.log('错误回调函数的捕获')
    switch (errorData?.code) {
      case 10402: // 未授权,未登录
        errorCallback?.onAuthorized?.(errorData)
        break
      default:
        errorCallback?.onError?.(errorData)
        break
    }
  }

  // 二次封装，兼容openapi
  async openApiRequest<T = any>(url: string, options?: OptionsType) {
    try {
      const result = await http.request<T>(options?.method || 'post', url, {
        ...options,
      })
      return result
    } catch (error) {
      this.errorHandler(error as ResponseData, options?.ErrorCallback)
      return Promise.reject(error)
    }
  }
}
const httpService = new HttpService()
const openApiRequest = httpService.openApiRequest.bind(httpService)

export { openApiRequest }
