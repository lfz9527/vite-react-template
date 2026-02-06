import { useNavigate } from 'react-router'
import { motion } from 'motion/react'

import { cn } from '@utils/index'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <motion.div
      className='flex h-full flex-col items-center justify-center bg-gray-50 px-4 text-center'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className='mb-4 text-9xl font-extrabold text-gray-200'
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        404
      </motion.h1>

      <motion.h2
        className='mb-2 text-3xl font-bold text-gray-900'
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        页面未找到
      </motion.h2>

      <motion.p
        className='mb-6 max-w-md text-gray-600'
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        抱歉，你访问的页面不存在或已被移除。
      </motion.p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <button
          className={cn(
            'flex-center cursor-pointer flex-nowrap gap-2 px-4 py-2 select-none',
            'rounded-lg bg-[#030213] text-sm whitespace-nowrap text-white',
            'hover:opacity-80 disabled:pointer-events-none disabled:opacity-50'
          )}
          onClick={() => {
            navigate('/', { replace: true })
          }}
        >
          返回首页
        </button>
      </motion.div>
    </motion.div>
  )
}
