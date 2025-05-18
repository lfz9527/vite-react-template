// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace API {
  interface ResponseData<T = any> {
    data: T
    message: string
    code: number
  }
}
