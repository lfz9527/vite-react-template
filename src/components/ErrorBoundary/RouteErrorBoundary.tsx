import { useEffect } from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router'

export const RouteErrorBoundary = () => {
  const error = useRouteError()

  useEffect(() => {
    if (!error) return
    console.error('路由错误捕获:', error)
  }, [error])

  const handleRetry = () => {
    window.location.reload()
  }

  // 展示友好 UI
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6'>
      <div className='w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg'>
        <h1 className='mb-4 text-3xl font-bold text-red-600'>Oops!</h1>
        <p className='mb-6 text-gray-700'>
          {isRouteErrorResponse(error)
            ? `请求出错：${error.status} ${error.statusText}`
            : error instanceof Error
              ? error.message
              : '未知错误发生'}
        </p>

        <div className='flex justify-center gap-4'>
          <button
            onClick={handleRetry}
            className='cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white shadow transition-colors hover:bg-red-700'
          >
            刷新页面
          </button>
          <a
            href='/'
            className='rounded-lg bg-gray-200 px-4 py-2 text-gray-800 shadow transition-colors hover:bg-gray-300'
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
}
