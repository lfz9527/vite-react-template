import React from 'react'

interface Props {
  onRetry?: () => void
}

const GlobalCrash: React.FC<Props> = ({ onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      // 默认行为：刷新页面
      window.location.reload()
    }
  }

  return (
    <div className='flex-center h-screen flex-col p-6 text-center'>
      <div className='mb-3 text-[20px] font-[600]'>系统出现了错误</div>
      <div className='mb-6 text-base text-[#666]'>请尝试刷新页面或稍后重试</div>
      <button
        onClick={handleRetry}
        className='cursor-pointer rounded-[6px] border-[1px] border-[#ccc] px-4 py-2 text-base'
      >
        刷新页面
      </button>
    </div>
  )
}

export default GlobalCrash
