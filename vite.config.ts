import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const resolve = (paths: string) => {
  return path.resolve(__dirname, paths)
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 配置路径别名
  resolve: {
    alias: {
      '@': resolve('src'),
      '@/assets': resolve('src/assets'),
      '@/service': resolve('src/service'),
      '@/pages': resolve('src/pages'),
      '@/components': resolve('src/components'),
      '@/styles': resolve('src/styles'),
      '@/utils': resolve('src/utils'),
      '@/hooks': resolve('src/hooks'),
      '@/router': resolve('src/router'),
      '@/store': resolve('src/store'),
      '@/types': resolve('src/types'),
    },
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
        },
      },
    },
  },
  server: {
    // host 为0.0.0.0 时，可以被外部访问，允许 localhost 和 ip 同时进行访问
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
})
