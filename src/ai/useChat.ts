import { type AbstractChat, type ChatInit } from './chat'
import { useRef, useCallback, useSyncExternalStore } from 'react'
import { Chat } from './chat.state'

import { type UIMessage } from './ui-message'

export type UseChatHelpers<UI_MESSAGE extends UIMessage> = {
  readonly id: string
  setMessages: (
    messages: UI_MESSAGE[] | ((messages: UI_MESSAGE[]) => UI_MESSAGE[])
  ) => void
} & Pick<
  AbstractChat<UI_MESSAGE>,
  'sendMessage' | 'status' | 'messages' | 'clearError' | 'stop'
>

export type UseChatOptions<UI_MESSAGE extends UIMessage> = (
  | ChatInit<UI_MESSAGE>
  | { chat: Chat<UI_MESSAGE> }
) & {
  experimental_throttle?: number
}

export function useChat<UI_MESSAGE extends UIMessage = UIMessage>({
  experimental_throttle: throttleWaitMs,
  ...options
}: UseChatOptions<UI_MESSAGE>) {
  const chatRef = useRef<Chat<UI_MESSAGE>>(
    'chat' in options ? options.chat : new Chat(options)
  )
  const shouldRecreateChat =
    ('chat' in options && options.chat !== chatRef.current) ||
    ('id' in options && chatRef.current.id !== options.id)

  if (shouldRecreateChat) {
    chatRef.current = 'chat' in options ? options.chat : new Chat(options)
  }

  const optionsId = 'id' in options ? options.id : null

  const subscribeToMessages = useCallback(
    (update: () => void) =>
      chatRef.current['~registerMessagesCallback'](update, throttleWaitMs),
    // 聊天ID更改时需要optionsId才能触发重新订阅
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [throttleWaitMs, optionsId]
  )

  // 使用 useSyncExternalStore 去监听消息变化
  const messages = useSyncExternalStore(
    subscribeToMessages,
    () => chatRef.current.messages,
    () => chatRef.current.messages
  )

  const status = useSyncExternalStore(
    chatRef.current['~registerStatusCallback'],
    () => chatRef.current.status,
    () => chatRef.current.status
  )

  const error = useSyncExternalStore(
    chatRef.current['~registerErrorCallback'],
    () => chatRef.current.error,
    () => chatRef.current.error
  )

  const setMessages = useCallback(
    (
      messagesParam: UI_MESSAGE[] | ((messages: UI_MESSAGE[]) => UI_MESSAGE[])
    ) => {
      if (typeof messagesParam === 'function') {
        messagesParam = messagesParam(chatRef.current.messages)
      }
      chatRef.current.messages = messagesParam
    },
    [chatRef]
  )

  return {
    id: chatRef.current.id,
    messages,
    setMessages,
    sendMessage: chatRef.current.sendMessage,
    error,
    status,
    clearError: chatRef.current.clearError,
    stop: chatRef.current.stop,
  }
}
