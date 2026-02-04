import { router } from './routes'
import { RouterProvider } from 'react-router'

import { FetchDemo } from './service/api'

import { useEffect } from 'react'

const App = () => {
  const fetchDemo = async () => {
    const res = await FetchDemo()
    console.log(res.data)
  }

  useEffect(() => {
    fetchDemo()
  }, [])

  return (
    <>
      <div className='flex-center py-50'>
        <h1 className='text-3xl font-bold'>Vite React Template</h1>
      </div>
      <RouterProvider router={router} />
    </>
  )
}

export default App
