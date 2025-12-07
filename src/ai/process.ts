import { type Job, type ErrorCall } from './types'
import { type UIMessage, type UIMessageChunk } from './ui-message'
import { type StreamingUIMessageState } from './chat'
import { ChatError } from './error'

export class SerialJobExecutor {
  private queue: Array<Job> = []
  private isProcessing = false

  private async processQueue() {
    if (this.isProcessing) {
      return
    }

    this.isProcessing = true

    while (this.queue.length > 0) {
      await this.queue[0]()
      this.queue.shift()
    }

    this.isProcessing = false
  }

  async run(job: Job): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await job()
          resolve()
        } catch (error) {
          reject(error)
        }
      })

      void this.processQueue()
    })
  }
}

interface ProcessUIMessageStreamOptions<
  UI_MESSAGE extends UIMessage,
  M = unknown,
> {
  stream: ReadableStream<UIMessageChunk<M>>
  onData?: (metadata: UIMessageChunk<M>) => void
  runUpdateMessageJob: (
    job: (options: {
      state: StreamingUIMessageState<UI_MESSAGE>
      write: () => void
    }) => Promise<void>
  ) => Promise<void>
  onError: ErrorCall
}
export function processUIMessageStream<
  UI_MESSAGE extends UIMessage,
  M = unknown,
>({
  stream,
  onData,
  runUpdateMessageJob,
  onError,
}: ProcessUIMessageStreamOptions<UI_MESSAGE, M>): ReadableStream<
  UIMessageChunk<M>
> {
  return stream.pipeThrough(
    new TransformStream<UIMessageChunk<M>, UIMessageChunk<M>>({
      async transform(chunk, controller) {
        await runUpdateMessageJob(async ({ state, write }) => {
          console.log(state)
          // @TODO 业务处理
          if (chunk.Code === 10000) {
            onData?.(chunk)
          } else {
            onError(new ChatError(chunk.Msg, chunk.Code))
          }
          write()
        })
        controller.enqueue(chunk)
      },
    })
  )
}
