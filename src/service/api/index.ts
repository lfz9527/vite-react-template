import { openApiRequest as request } from '../http-service'

export async function FetchDemo<T = string>(options?: { [key: string]: any }) {
  return request<T>('/api/Vip/GetVipPackageByOpen11', {
    method: 'GET',
    ...(options || {}),
  })
}
