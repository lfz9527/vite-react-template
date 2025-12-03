import { http } from './http-base'
import type {
  AxiosRequestConfig,
  Method,
  ErrorCallback,
  ResponseData,
  RequestKey,
  RetryConfig,
  FetchOptions,
  StreamCallback,
  ChunkData,
} from './type'

interface OptionsType extends AxiosRequestConfig {
  method?: Method
  errorCallback?: ErrorCallback
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
      const result = await http.request<T>(url, options?.method || 'post', {
        ...options,
      })
      return result
    } catch (error) {
      this.errorHandler(error as ResponseData, options?.errorCallback)
      return Promise.reject(error)
    }
  }

  // 处理流式相应
  async sseRequest(
    url: string,
    callback: StreamCallback,
    options: FetchOptions
  ) {
    try {
      const result = await http.fetch(url, {
        origin: true,
        ...options,
      })
      this.GenStreamResponse(result, callback)
    } catch (error) {
      this.errorHandler(error as ResponseData, callback)
      return Promise.reject(error)
    }
  }
  // 生成响应流
  async GenStreamResponse(response: Response, callback: StreamCallback) {
    const code = 10400
    let reader = null
    let complete = false
    let isError = false
    let chunkData = null
    try {
      reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      if (!response.body) {
        throw new Error('Response body is not readable (not a stream)')
      }

      if (!reader) {
        throw new Error('响应流错误')
      }

      callback.onStreamStart?.()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          complete = true
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留未完成的行

        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed) {
            try {
              const data: ChunkData = JSON.parse(trimmed)
              chunkData = data
              // 自定义解析业务中的流
              callback.onStreamUpdate?.(data)
            } catch (e: any) {
              isError = true
              const errMsg = 'JSON解析失败:' + trimmed
              callback.onStreamError?.({
                code: 100400,
                message: errMsg,
                data: chunkData,
              })
              throw new Error(e || errMsg)
            }
          }
        }
      }
    } catch (error) {
      isError = true
      this.errorHandler(
        { code, message: error || '响应错误' } as ResponseData,
        callback
      )
    } finally {
      callback.onStreamComplete?.({ complete, error: isError })
      reader?.releaseLock()
    }
  }
}
const httpService = new HttpService()
const openApiRequest = httpService.openApiRequest.bind(httpService)

export { openApiRequest }
