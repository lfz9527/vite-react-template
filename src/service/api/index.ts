import { openApiRequest as request } from '../http-service'

export async function getVipGetVipPackageByOpen(options?: {
  [key: string]: any
}) {
  return request('/api/Vip/GetVipPackageByOpen11', {
    method: 'GET',
    ...(options || {}),
  })
}
