import {
  EventSourceParserStream,
  type EventSourceMessage,
} from 'eventsource-parser/stream'
import { type METADATA } from './ui-message'
import { type ErrorCall } from './types'

// @TODO json校验
export function parseJson(text: string) {
  return JSON.parse(text)
}

export function parseJsonEventStream<T>({
  stream,
}: {
  stream: ReadableStream<Uint8Array>
  onError?: ErrorCall
}): ReadableStream<METADATA<T>> {
  return stream
    .pipeThrough(
      new TextDecoderStream() as ReadableWritablePair<string, Uint8Array>
    )
    .pipeThrough(new EventSourceParserStream())
    .pipeThrough(
      new TransformStream<EventSourceMessage, METADATA<T>>({
        transform(event, controller) {
          if (!event.data) return
          controller.enqueue(parseJson(event.data) as METADATA<T>)
        },
      })
    )
}
