// 错误处理，
export class ChatError<T = unknown> extends Error {
  code: number
  data?: T
  originalError?: Error // ⭐ 保存原始 error（如果有）

  constructor(
    messageOrError: string | Error = '',
    code: number = 100400,
    data?: T
  ) {
    // 如果传入的是 Error，使用它的 message，否则为 string
    super(
      typeof messageOrError === 'string'
        ? messageOrError
        : messageOrError.message
    )

    this.code = code
    this.data = data

    // 如果是 Error，把原始 error 保存下来
    if (messageOrError instanceof Error) {
      this.originalError = messageOrError

      // 覆盖 stack，使 ChatError 继承原始堆栈信息（通常更有用）
      this.stack = messageOrError.stack
    }

    this.name = 'ChatError'

    Object.setPrototypeOf(this, ChatError.prototype)
  }
}
