import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { lessVars } from './config/lessGlobalVars.ts'
import path from 'path'

const resolve = (paths: string) => {
  return path.resolve(__dirname, paths)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // 配置路径别名
  resolve: {
    alias: {
      '@': resolve('src'),
      '@/assets': resolve('src/assets'),
      '@/components': resolve('src/components'),
      '@/styles': resolve('src/styles'),
      '@/utils': resolve('src/utils')
    }
  },
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
  build: {
    // 自定义资源的输出目录
    rollupOptions: {
      output: {
        // 自定义 JavaScript 文件的输出目录
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        // 自定义 CSS 文件的输出目录
        assetFileNames: (info: Record<string, any>) => {
          const infoType = info.name ? info.name.split('.').pop() : ''
          if (infoType && /^(gif|jpe?g|png|svg)$/.test(infoType)) {
            return 'assets/[name]-[hash][extname]'
          }
          if (infoType === 'css') {
            return 'css/[name]-[hash][extname]'
          }
          if (infoType === 'ttf') {
            return 'font/[name]-[hash][extname]'
          }
          // 默认输出目录
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
