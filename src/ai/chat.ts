import {
  type UIMessage,
  type UIMessageChunk,
  type UIMessagePart,
} from './ui-message'
import { ChatError } from './error'
import {
  consumeStream,
  generateId as generateIdFunc,
  type IdGenerator,
} from './utils'

import { SerialJobExecutor, processUIMessageStream } from './process'
import {
  DefaultChatTransport,
  type ChatTransport,
  type ChatRequestOptions,
} from './chat-transport'

export type CreateUIMessage<UI_MESSAGE extends UIMessage> = Omit<
  UI_MESSAGE,
  'metadata' | 'id'
> & {
  messageId?: UI_MESSAGE['id']
  id?: UI_MESSAGE['id']
}

// 提交中 | 流式响应中 | '响应结束' | '错误'
export type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'

export interface ChatState<UI_MESSAGE extends UIMessage> {
  status: ChatStatus
  error: Error | undefined
  messages: UI_MESSAGE[]
  pushMessage: (message: UI_MESSAGE) => void
  popMessage: () => void
  replaceMessage: (index: number, message: UI_MESSAGE) => void
  // 消息快照
  snapshot: <T>(thing: T) => T
}

// 错误回调函数
export type ChatOnErrorCallback<T = unknown> = (errData: ChatError<T>) => void

// 接收数据回调函数
type ChatOnDataCallback<METADATA = unknown> = (
  metadata: UIMessageChunk<METADATA>
) => UIMessage

// 结束原因
// 正常流结束 | 用户手动停止 | 流数据中业务错误
type FinishReason = 'complete' | 'handleStop' | 'response-error'

export type StreamingUIMessageState<UI_MESSAGE = UIMessage> = {
  message: UI_MESSAGE
  finishReason?: FinishReason
}

// 当前活跃响应
type ActiveResponse<UI_MESSAGE extends UIMessage> = {
  state: StreamingUIMessageState<UI_MESSAGE>
  abortController: AbortController
}

export function createStreamingUIMessageState<UI_MESSAGE extends UIMessage>({
  lastMessage,
  messageId,
}: {
  lastMessage: UI_MESSAGE | undefined
  messageId: string
}): StreamingUIMessageState<UI_MESSAGE> {
  return {
    message:
      lastMessage?.role === 'ai'
        ? lastMessage
        : ({
            id: messageId,
            metadata: undefined,
            role: 'ai',
            parts: [] as UIMessagePart[],
          } as unknown as UI_MESSAGE),
  }
}

export type ChatOnFinishCallback<UI_MESSAGE extends UIMessage> = (options: {
  message: UI_MESSAGE
  messages: UI_MESSAGE[]
  isAbort: boolean
  isError: boolean
  finishReason?: FinishReason
}) => void

export interface ChatInit<UI_MESSAGE extends UIMessage, METADATA = unknown> {
  // 会话Id
  id: string
  // 消息列表
  messages?: UI_MESSAGE[]
  // 随机id,当没有消息id时,会随机生成一个消息Id
  generateId?: IdGenerator
  // 转换器
  transport?: ChatTransport
  // 错误回调
  onError?: ChatOnErrorCallback
  //  接收到数据部分时调用的可选回调函数。
  onData?: ChatOnDataCallback<METADATA>
  // 流响应完整回调
  onFinish?: ChatOnFinishCallback<UI_MESSAGE>
  // 工具回调 // @TODO
  onToolCall?: () => void
}

export abstract class AbstractChat<UI_MESSAGE extends UIMessage, M = unknown> {
  readonly id: string
  readonly generateId: IdGenerator
  protected state: ChatState<UI_MESSAGE>

  private readonly transport: ChatTransport<M>

  private activeResponse: ActiveResponse<UI_MESSAGE> | undefined = undefined

  private onError?: ChatInit<UI_MESSAGE, M>['onError']
  private onToolCall?: ChatInit<UI_MESSAGE, M>['onToolCall']
  private onFinish?: ChatInit<UI_MESSAGE, M>['onFinish']
  private onData?: ChatInit<UI_MESSAGE, M>['onData']

  private jobExecutor = new SerialJobExecutor()

  constructor({
    generateId = generateIdFunc,
    id = generateId(),
    transport = new DefaultChatTransport<M>(),
    state,
    onError,
    onToolCall,
    onFinish,
    onData,
  }: Omit<ChatInit<UI_MESSAGE, M>, 'messages'> & {
    state: ChatState<UI_MESSAGE>
  }) {
    this.id = id
    this.transport = transport as ChatTransport<M>
    this.generateId = generateId
    this.state = state
    this.onError = onError
    this.onToolCall = onToolCall
    this.onFinish = onFinish
    this.onData = onData
  }
  get status(): ChatStatus {
    return this.state.status
  }
  protected setStatus({
    status,
    error,
  }: {
    status: ChatStatus
    error?: Error
  }) {
    if (this.status === status) return
    this.state.status = status
    this.state.error = error
  }

  get error() {
    return this.state.error
  }

  get messages(): UI_MESSAGE[] {
    return this.state.messages
  }

  get lastMessage(): UI_MESSAGE | undefined {
    return this.state.messages[this.state.messages.length - 1]
  }

  set messages(messages: UI_MESSAGE[]) {
    this.state.messages = messages
  }

  async sendMessage(
    message: CreateUIMessage<UI_MESSAGE>,
    options?: ChatRequestOptions
  ): Promise<void> {
    if (message.messageId != null) {
      const messageIndex = this.state.messages.findIndex(
        (m) => m.id === message.messageId
      )

      if (messageIndex === -1) {
        throw new Error(`message with id ${message.messageId} not found`)
      }

      if (this.state.messages[messageIndex].role !== 'user') {
        throw new Error(
          `message with id ${message.messageId} is not a user message`
        )
      }
      // 移除指定位置后的所有消息
      this.state.messages = this.state.messages.slice(0, messageIndex + 1)

      // 更新消息 在指定位置替换消息
      this.state.replaceMessage(messageIndex, {
        ...message,
        id: message.messageId,
        role: message.role ?? 'user',
      } as UI_MESSAGE)
    } else {
      this.state.pushMessage({
        ...message,
        id: message.id ?? this.generateId(),
        role: message.role ?? 'user',
      } as UI_MESSAGE)
    }

    await this.makeRequest({
      ...options,
    })
  }
  private async makeRequest({
    headers,
    body,
  }: ChatRequestOptions): Promise<void> {
    this.setStatus({ status: 'submitted', error: undefined })
    const lastMessage = this.lastMessage
    let isAbort = false
    let isError = false

    try {
      const activeResponse = {
        state: createStreamingUIMessageState({
          lastMessage: this.state.snapshot(lastMessage),
          messageId: this.generateId(),
        }),
        abortController: new AbortController(),
      } as ActiveResponse<UI_MESSAGE>

      activeResponse.abortController.signal.addEventListener('abort', () => {
        isAbort = true
      })

      this.activeResponse = activeResponse

      const stream = await this.transport.sendMessages({
        abortSignal: activeResponse.abortController.signal,
        headers,
        body,
      })

      const runUpdateMessageJob = (
        job: (options: {
          state: StreamingUIMessageState<UI_MESSAGE>
          write: () => void
        }) => Promise<void>
      ) =>
        // 序列化作业执行以避免竞争条件：
        this.jobExecutor.run(() =>
          job({
            state: activeResponse.state,
            write: () => {
              // 流式响应设置在第一次写入（在“提交”之前）
              this.setStatus({ status: 'streaming' })

              const replaceLastMessage =
                activeResponse.state.message.id === this.lastMessage?.id

              if (replaceLastMessage) {
                this.state.replaceMessage(
                  this.state.messages.length - 1,
                  activeResponse.state.message
                )
              } else {
                this.state.pushMessage(activeResponse.state.message)
              }
            },
          })
        )

      await consumeStream({
        stream: processUIMessageStream({
          stream,
          onData: this.onData,
          runUpdateMessageJob,
          onError: (error) => {
            throw error
          },
        }),
        onError: (error) => {
          throw new ChatError(error)
        },
      })
    } catch (error: any) {
      // 请求终止错误
      if (isAbort || (error as any).name === 'AbortError') {
        isAbort = true
        this.setStatus({ status: 'ready' })
        return
      }
      if (this.onError && error instanceof ChatError) {
        this.onError(error)
      }
      isError = true
    } finally {
      try {
        this.onFinish?.({
          message: this.activeResponse!.state.message,
          messages: this.state.messages,
          isAbort,
          isError,
          finishReason: this.activeResponse?.state.finishReason,
        })
      } catch (err) {
        console.error(err)
      }

      this.activeResponse = undefined
    }
  }
}
