import { router } from './routes'
import { RouterProvider } from 'react-router'
import { parseJsonEventStream } from '@/ai/parse'
import { useEffect } from 'react'

const App = () => {
  const readStream = async () => {
    const response = await fetch('/messages.json')
    if (!response.body) return

    parseJsonEventStream<{ msg: string }>({ stream: response.body })
  }

  useEffect(() => {
    readStream()
  }, [])

  return <RouterProvider router={router} />
}

export default App
