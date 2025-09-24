export {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Method,
  type AxiosError,
} from 'axios'

// 业务响应数据基础结构
export interface ResponseData<T = any> {
  code: number
  message?: string
  data: T
}

// 拦截器配置类型
export interface InterceptorsConfig {
  requestInterceptor?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig
  requestErrorInterceptor?: (error: AxiosError) => Promise<any>
  responseInterceptor?: (response: AxiosResponse<ResponseData<any>>) => any
  responseErrorInterceptor?: (error: AxiosError) => Promise<any>
}

// 请求唯一键
export type RequestKey = string | symbol

// 重试配置
export interface RetryConfig {
  retries?: number // 重试次数
  retryDelay?: number // 重试延迟（毫秒）
  retryCondition?: (error: AxiosError) => boolean // 重试条件
}

// 错误回调
export interface ErrorCallback {
  onError?: (error: ResponseError) => void
  onAuthorized?: (error: ResponseError) => void
}
