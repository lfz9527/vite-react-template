import React from 'react'

interface Props {
  error?: unknown
}

// 全局错误捕获
export const GlobalCrash: React.FC<Props> = ({ error }) => {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6'>
      <div className='max-h-[800px] w-full max-w-[1200px] rounded-xl bg-white p-8 text-center shadow-lg'>
        <h1 className='mb-4 text-3xl font-bold text-red-600'>出现了意外错误</h1>
        <p className='mb-6 text-gray-700'>
          {error instanceof Error
            ? error.message
            : error
              ? String(error)
              : '未知错误，请稍后重试'}
        </p>

        <pre className='mb-6 min-h-48 overflow-auto rounded bg-gray-100 p-2 text-left text-xs text-gray-500'>
          {error instanceof Error ? error.stack : ''}
        </pre>

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
