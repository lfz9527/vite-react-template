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
export type ResponseData<T = any> = Global.Response<T>

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

export interface FetchOptions extends RequestInit {
  // 入参 和 axios 统一都是有data
  data?: any
  // 是否返回原相应
  origin?: boolean
}

// 流式响应回调
export interface StreamCallback extends ErrorCallback {
  // 开始响应
  onStreamStart?: () => void
  // 响应中的更新
  onStreamUpdate?: (data: ChunkData) => void
  // 相应成功
  onStreamSuccess?: (data: ChunkData) => void
  // 响应错误
  onStreamError?: (data: ResponseData) => void
  // 响应结束
  onStreamComplete?: ({ complete: boolean, error: boolean }) => void
}

// 响应流json对象类型
export interface ChunkData {
  id: string
  OutputMessage: string
}
