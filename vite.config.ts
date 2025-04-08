import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { lessVars } from './config/lessGlobalVars.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  css: {
    modules: {
      // 配置 CSS Modules 的类名生成规则
      generateScopedName: '_[local]_[hash:base64:5]',
      // 配置不需要进行 CSS Modules 的文件
      globalModulePaths: []
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // less配置全局变量
        globalVars: lessVars
      }
    }
  },
})
