import { axiosRequest } from './axois-request'
import type { AxiosRequestConfig } from 'axios'

/**
 * 服务基类
 */
class ServiceBase {
  public async request<T>(options: AxiosRequestConfig) {
    const { data } = await axiosRequest.instance.request<T>(options)
    return data
  }

  public async get<T>(url: string, options: AxiosRequestConfig = {}) {
    const { data } = await axiosRequest.instance.get<T>(url, options)
    return data
  }

  public async post<T>(url: string, options: AxiosRequestConfig = {}) {
    const { data } = await axiosRequest.instance.post<T>(url, options)
    return data
  }
}

export const apiService = new ServiceBase()
