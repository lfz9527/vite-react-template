import { apiService } from '@service/service-base'

export const getApi = () => apiService.get<API.ResponseData>('/api/get')
export const getApi2 = () => apiService.get<API.ResponseData>('/api/get2')
export const postApi = (data: any) =>
  apiService.post<API.ResponseData>('/api/post', {
    data,
  })
