import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@/styles/tailwindcss.css'
import 'virtual:svg-icons-register'
import { ConfigProvider } from 'antd'
import { MessageProvider } from '@context'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </ConfigProvider>
  </StrictMode>
)
