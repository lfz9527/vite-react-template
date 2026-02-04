import { openApiRequest as request, type OptionsConfig } from '../http-service'

export async function FetchDemo<T = string>(
  options?: OptionsConfig & { [key: string]: any }
) {
  return request<T>('/api/Vip/GetVipPackageByOpen11', {
    method: 'GET',
    ...(options || {}),
  })
}
