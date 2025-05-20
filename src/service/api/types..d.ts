declare namespace API {
  interface ResponseData<T = any> {
    data: T
    message: string
    code: number
  }
}
