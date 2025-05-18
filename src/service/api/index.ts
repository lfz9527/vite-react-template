import { apiService } from '../service-base'

export const getApi = () => apiService.get<API.ResponseData>('/api/get')
export const postApi = (data: any) =>
  apiService.post<API.ResponseData>('/api/post', {
    data,
  })
