import { mergeObjects } from './utils'
import { type METADATA } from './ui-message'
import { parseJsonEventStream } from './parse'

type FetchFunction = typeof globalThis.fetch

export type ChatRequestOptions = {
  // 接口地址
  api?: string
  /**
   * 请求头
   */
  headers?: Record<string, string> | Headers

  /**
   * 请求体
   */
  body?: object
}

export interface ChatTransport<M = unknown> {
  sendMessages: (
    options: {
      // 接口中止请求的信号
      abortSignal: AbortSignal | undefined
    } & Omit<ChatRequestOptions, 'api'>
  ) => Promise<ReadableStream<METADATA<M>>>
}

abstract class HttpChatTransport<M = unknown> implements ChatTransport {
  protected api: string
  protected headers: ChatRequestOptions['headers']
  protected body: ChatRequestOptions['body']
  protected fetch?: FetchFunction

  constructor({ api = '/api/chat', headers, body }: ChatRequestOptions) {
    this.api = api
    this.headers = headers
    this.body = body
    this.fetch = fetch
  }
  async sendMessages({
    abortSignal,
    ...options
  }: Parameters<ChatTransport['sendMessages']>[0]) {
    const fetch = this.fetch ?? globalThis.fetch
    const headers = mergeObjects(this.headers, options.headers)
    const body = mergeObjects(this.body, options.body)

    const response = await fetch(this.api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      signal: abortSignal,
    })

    if (!response.ok) {
      throw new Error(
        (await response.text()) ?? 'Failed to fetch the chat response.'
      )
    }

    if (!response.body) {
      throw new Error('The response body is empty.')
    }
    return this.processResponseStream(response.body)
  }

  protected abstract processResponseStream(
    stream: ReadableStream<Uint8Array>
  ): Promise<ReadableStream<METADATA<M>>>
}

export class DefaultChatTransport<M = unknown> extends HttpChatTransport<M> {
  constructor(options: ChatRequestOptions = {}) {
    super(options)
  }

  // 解析流
  protected async processResponseStream(
    stream: ReadableStream<Uint8Array>
  ): Promise<ReadableStream<METADATA<M>>> {
    return parseJsonEventStream<M>({ stream }).pipeThrough(
      new TransformStream<METADATA<M>, METADATA<M>>({
        transform(chunk, controller) {
          controller.enqueue(chunk)
        },
      })
    )
  }
}
