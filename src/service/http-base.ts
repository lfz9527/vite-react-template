import { defaultConfig, commonErrors } from './config'
import {
  type AxiosInstance,
  type RequestKey,
  type AxiosRequestConfig,
  type InterceptorsConfig,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type ResponseData,
  type Method,
  type RetryConfig,
  type FetchOptions,
} from './type'
import Axios from 'axios'
import { stringify } from 'qs'

/**
 * 增强型 HTTP 客户端，基于 Axios 封装
 * 支持拦截器配置、请求取消、多实例管理等功能
 */
class HttpBase {
  private instance: AxiosInstance
  private requestInterceptorId?: number
  private responseInterceptorId?: number
  private abortControllers: Map<RequestKey, AbortController> = new Map()

  /**
   * 创建 HTTP 客户端实例
   * @param customConfig 自定义 Axios 配置
   * @param interceptors 自定义拦截器配置
   */
  constructor(
    customConfig?: AxiosRequestConfig,
    interceptors?: InterceptorsConfig
  ) {
    this.instance = Axios.create({ ...defaultConfig, ...customConfig })
    this.initInterceptors(interceptors)
  }

  /** 初始化拦截器 */
  private initInterceptors(interceptors?: InterceptorsConfig): void {
    this.initRequestInterceptor(
      interceptors?.requestInterceptor,
      interceptors?.requestErrorInterceptor
    )
    this.initResponseInterceptor(
      interceptors?.responseInterceptor,
      interceptors?.responseErrorInterceptor
    )
  }

  /** 初始化请求拦截器 */
  private initRequestInterceptor(
    customInterceptor?: InterceptorsConfig['requestInterceptor'],
    customErrorInterceptor?: InterceptorsConfig['requestErrorInterceptor']
  ) {
    // 默认请求拦截器
    const defaultInterceptor = (
      config: InternalAxiosRequestConfig
    ): InternalAxiosRequestConfig => {
      /* 在这里写请求拦截器的默认业务逻辑 */
      return config
    }

    // 默认请求错误拦截器
    const defaultErrorInterceptor = (error: AxiosError): Promise<any> => {
      /* 在这里写请求错误拦截器的默认业务逻辑 */
      // 示例: 处理请求前的错误
      return Promise.reject(error)
    }

    // 优先使用自定义拦截器，否则使用默认拦截器
    this.requestInterceptorId = this.instance.interceptors.request.use(
      customInterceptor || defaultInterceptor,
      customErrorInterceptor || defaultErrorInterceptor
    )
  }
  // 默认响应错误拦截器
  defaultErrorInterceptor(error: AxiosError): Promise<any> {
    if (error.config) {
      const requestKey = this.getRequestKey(error.config)
      if (requestKey) this.abortControllers.delete(requestKey)
    }

    // HTTP状态码错误处理
    let status = 200

    // 处理请求被取消的情况
    if (Axios.isCancel(error)) {
      console.warn('请求已被取消:', error.message)
      status = 499
      return Promise.reject({
        code: status,
        message: commonErrors[status],
      })
    }
    // 网络错误处理
    if (!(error as AxiosError).response) {
      if (
        (error as any).code === 'ECONNABORTED' ||
        (error as AxiosError).message?.includes('timeout')
      ) {
        status = 408
        return Promise.reject({
          code: status,
          message: commonErrors[status],
        })
      }
      status = 503
      return Promise.reject({
        code: status,
        message: commonErrors[status],
      })
    }
    // HTTP状态码错误处理
    status = (error as AxiosError).response?.status ?? 502
    return this.errorResponse(status)
  }
  errorResponse(status: number = 502) {
    const message = commonErrors[status] || `请求失败（状态码：${status}）`
    return Promise.reject({
      code: status,
      message,
    })
  }

  /** 初始化响应拦截 */
  private initResponseInterceptor(
    customInterceptor?: InterceptorsConfig['responseInterceptor'],
    customErrorInterceptor?: InterceptorsConfig['responseErrorInterceptor']
  ): void {
    // 默认响应拦截器
    const defaultInterceptor: InterceptorsConfig['responseInterceptor'] = (
      response: AxiosResponse<ResponseData<any>>
    ) => {
      const requestKey = this.getRequestKey(response.config)
      if (requestKey) this.abortControllers.delete(requestKey)
      /* 在这里写响应拦截器的默认业务逻辑 */
      return response
    }

    // 优先使用自定义拦截器，否则使用默认拦截器
    this.responseInterceptorId = this.instance.interceptors.response.use(
      customInterceptor || defaultInterceptor,
      customErrorInterceptor || this.defaultErrorInterceptor
    )
  }

  /** 生成请求唯一标识 */
  private getRequestKey(config: AxiosRequestConfig): RequestKey | undefined {
    if (!config.url) return undefined
    return `${config.method?.toUpperCase()}-${config.url}`
  }

  /** 设置取消控制器 - 用于取消重复请求或主动取消请求 */
  private setupCancelController(
    config: AxiosRequestConfig,
    requestKey?: RequestKey
  ): AxiosRequestConfig {
    const key = requestKey || this.getRequestKey(config)
    if (!key) return config

    // 如果已有相同key的请求，先取消它
    this.cancelRequest(key)

    const controller = new AbortController()
    this.abortControllers.set(key, controller)

    return {
      ...config,
      signal: controller.signal,
    }
  }

  /** 移除请求拦截器 */
  public removeRequestInterceptor(): void {
    if (this.requestInterceptorId !== undefined) {
      this.instance.interceptors.request.eject(this.requestInterceptorId)
      this.requestInterceptorId = undefined // 重置ID，避免重复移除
    }
  }

  /** 移除响应拦截器 */
  public removeResponseInterceptor(): void {
    if (this.responseInterceptorId !== undefined) {
      this.instance.interceptors.response.eject(this.responseInterceptorId)
      this.responseInterceptorId = undefined // 重置ID，避免重复移除
    }
  }

  /** 动态设置请求拦截器 */
  public setRequestInterceptor(
    customInterceptor?: InterceptorsConfig['requestInterceptor'],
    customErrorInterceptor?: InterceptorsConfig['requestErrorInterceptor']
  ): void {
    this.removeRequestInterceptor()
    this.initRequestInterceptor(customInterceptor, customErrorInterceptor)
  }

  /** 动态设置响应拦截器 */
  public setResponseInterceptor(
    customInterceptor?: InterceptorsConfig['responseInterceptor'],
    customErrorInterceptor?: InterceptorsConfig['responseErrorInterceptor']
  ): void {
    this.removeResponseInterceptor()
    this.initResponseInterceptor(customInterceptor, customErrorInterceptor)
  }

  /** 获取 Axios 实例 */
  public getInstance(): AxiosInstance {
    return this.instance
  }

  /**
   * 取消某个请求
   * @param key 请求唯一标识
   * @param message 取消原因
   * @returns 是否成功取消
   */
  public cancelRequest(key: RequestKey, message?: string): boolean {
    const controller = this.abortControllers.get(key)
    if (controller) {
      controller.abort(message || `取消请求: ${String(key)}`)
      this.abortControllers.delete(key)
      return true
    }
    return false
  }

  /**
   * 取消所有请求
   * @param message 取消原因
   */
  public cancelAllRequests(message?: string): void {
    this.abortControllers.forEach((controller, key) => {
      controller.abort(message || `取消所有请求: ${String(key)}`)
    })
    this.abortControllers.clear()
  }

  /**
   * 判断是否为取消错误
   * @param error 错误对象
   * @returns 是否为取消错误
   */
  public static isCancel(error: unknown): boolean {
    return Axios.isCancel(error)
  }

  /**
   * 睡眠函数
   * @param ms 毫秒数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async request<T = Global.anyObj>(
    url: string,
    method: Method,
    config?: AxiosRequestConfig & {
      requestKey?: RequestKey
      retry?: RetryConfig
    }
  ): Promise<ResponseData<T>> {
    const { requestKey, retry, ...restConfig } = config || {}

    // 设置合理的默认重试条件
    const defaultRetryCondition = (error: AxiosError) => {
      // 默认只重试网络错误或5xx服务器错误
      return (
        !error.response ||
        (error.response.status >= 500 && error.response.status < 600)
      )
    }

    // 重试配置
    const retryConfig = {
      retries: 0,
      retryDelay: 1000,
      retryCondition: defaultRetryCondition,
      ...retry,
    }

    let lastError: any
    const key = requestKey ?? this.getRequestKey({ ...restConfig, method, url })
    for (let attempt = 0; attempt <= retryConfig.retries; attempt++) {
      try {
        // 重试前清除旧的AbortController（避免重试请求被误取消）
        if (attempt > 0 && key) {
          this.abortControllers.delete(key)
        }
        const requestConfig = this.setupCancelController(
          { ...restConfig, method, url },
          requestKey
        )

        const response =
          await this.instance.request<ResponseData<T>>(requestConfig)

        return response.data
      } catch (error) {
        lastError = error
        // 如果是最后一次尝试或不满足重试条件或请求被取消，直接抛出错误
        if (
          attempt === retryConfig.retries ||
          !retryConfig.retryCondition(error as AxiosError) ||
          HttpBase.isCancel(error)
        ) {
          break
        }
        // 延迟后重试
        if (retryConfig.retryDelay > 0) {
          await this.sleep(retryConfig.retryDelay)
        }
      }
    }
    return Promise.reject(lastError)
  }

  public get<T = Global.anyObj>(
    url: string,
    config?: AxiosRequestConfig & {
      requestKey?: RequestKey
      retry?: RetryConfig
    }
  ): Promise<ResponseData<T>> {
    return this.request<T>(url, 'get', config)
  }

  public post<T = Global.anyObj>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & {
      requestKey?: RequestKey
      retry?: RetryConfig
    }
  ): Promise<ResponseData<T>> {
    return this.request<T>(url, 'post', { ...config, data })
  }

  async fetch(url: string, options: FetchOptions): Promise<Response>

  async fetch<T = Global.anyObj>(
    url: string,
    options: FetchOptions
  ): Promise<ResponseData<T> | T>

  public async fetch<T = Global.anyObj>(
    url: string,
    options?: FetchOptions
  ): Promise<T | Response> {
    const { data, method, origin } = options || {}
    // 默认配置
    const { headers, baseURL } = defaultConfig
    // 统一变成小写处理
    const methodLower = method?.toLocaleLowerCase()
    // 配置
    const config = {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    }

    let link = url

    // 判断是否需要添加baseUrl
    if (baseURL) {
      if (!url.startsWith('http')) {
        link = baseURL + url
      }
    }

    // 区分 get 或者 head 方法不需要body  如果没填data 则默认为get 方法
    if (!methodLower || ['get', 'head'].includes(methodLower)) {
      const params = data ? `?${new URLSearchParams(data)}` : ''
      link = `${link}${params}`
      delete options?.data
      delete options?.body
    } else {
      config.body = data ? stringify(data) : ''
    }
    let response = null
    try {
      response = await fetch(link, config)
      if (!response?.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (origin) return response
      const result = await response.json()
      return result.data
    } catch (error: any) {
      console.error(error)
      return this.errorResponse(response?.status)
    }
  }
}

// 默认导出实例 - 可直接使用
export const http = new HttpBase()

export default HttpBase
