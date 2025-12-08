import { router } from './routes'
import { RouterProvider } from 'react-router'
import { useChat, DefaultChatTransport } from '@/ai'

const App = () => {
  // @ts-ignore
  // eslint-disable-next-line
  const { sendMessage, messages, status, stop } = useChat({
    id: '2233',
    experimental_throttle: 100,
    transport: new DefaultChatTransport<{ text: string }>({
      api: 'http://localhost:3000/sse',
    }),
    onData: (t) => {
      console.log('ondata', t)

      return {} as any
    },
    onError: (t) => {
      console.log('onError', t.message)
    },
    onFinish: (t) => {
      console.log('onFinish', t)
    },
  })

  console.log('messages', messages)

  const handleSSE = () => {
    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: 'css' }],
    })
  }

  return (
    <>
      <button
        className='flex-center h-9 rounded-lg bg-red-100 p-3'
        onClick={handleSSE}
      >
        发起SSE
      </button>
      <button
        className='flex-center h-9 rounded-lg bg-green-100 p-3'
        onClick={stop}
      >
        停止SSE
      </button>
      <RouterProvider router={router} />
    </>
  )
}

export default App
