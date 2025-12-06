import App from './App'
import '@/styles/tailwindcss.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'virtual:svg-icons-register'
import { GlobalCrash, ErrorBoundary } from '@/components/ErrorBoundary'

const root = createRoot(document.getElementById('root')!, {
  // 捕获 ErrorBoundary 内部的错误
  onCaughtError: (error) => {
    console.error('caught error', error)
  },
  // 捕获未捕获的错误（全局错误）
  onUncaughtError: (error) => {
    console.error('uncaught error', error)
  },
  // 捕获可恢复的错误（不会崩溃）
  onRecoverableError: (error) => {
    console.warn('recoverable error', error)
  },
  // 用于生成唯一 ID 前缀
  identifierPrefix: 'lf',
})

root.render(
  <StrictMode>
    {/* 全局错误捕获 */}
    <ErrorBoundary fallback={(error) => <GlobalCrash error={error} />}>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
