import { type AxiosRequestConfig, type CustomParamsSerializer } from './type'
import { stringify } from 'qs'

/** 通用错误码 */
export const commonErrors: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '权限不足',
  404: '请求的资源不存在',
  408: '请求超时，请稍后重试',
  499: '请求已被取消',
  500: '服务器内部错误',
  502: '网关错误',
  503: '网络错误，请检查网络连接',
  504: '网关超时',
}

// 默认配置
export const defaultConfig: AxiosRequestConfig = {
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
}
