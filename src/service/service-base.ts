// 服务基类

import { axiosRequest } from './axois-request'
import type { AxiosRequestConfig } from 'axios'


interface RequestConfig extends AxiosRequestConfig {
  errorCallback?: {
    onError?: (error: any) => void
    unAuthorized?: (error: any) => void
  }
}


/**
 * 服务基类
 */
class ServiceBase {

  /**
   * 错误处理
   * @param error 错误
   * @param errorCallback 针对性的错误回调
   */
  private errorHandler(error: any, errorCallback?: RequestConfig['errorCallback']) {
    switch (error?.code) {
      case 10402: // 未授权,未登录
        errorCallback?.unAuthorized?.(error)
        break;
      default:
        errorCallback?.onError?.(error)
        break;
    }
  }

  /**
   * 请求
   * @param options 请求配置
   * @returns 请求结果
   */
  public async request<T>(options: RequestConfig) {
    try {
      const { data } = await axiosRequest.instance.request<T>(options)
      return data
    } catch (error) {
      this.errorHandler(error, options.errorCallback)
      return Promise.reject(error)
    }
  }

  /**
   * get请求
   * @param url 请求地址
   * @param options 请求配置
   * @returns 请求结果
   */
  public async get<T>(url: string, options: RequestConfig = {}) {
    try {
      const { data } = await axiosRequest.instance.get<T>(url, options)
      return data
    } catch (error) {
      this.errorHandler(error, options.errorCallback)
      return Promise.reject(error)
    }
  }

  /**
   * post请求
   * @param url 请求地址
   * @param options 请求配置
   * @returns 请求结果
   */
  public async post<T>(url: string, options: RequestConfig = {}) {
    try {
      const { data } = await axiosRequest.instance.post<T>(url, options)
      return data
    } catch (error) {
      this.errorHandler(error, options.errorCallback)
      return Promise.reject(error)
    }
  }
}

export const apiService = new ServiceBase()
export const request = apiService.request
