import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugin from './vite/plugin'

const resolve = (paths: string) => {
  return path.resolve(__dirname, paths)
}

export default defineConfig(({ mode, command }) => {
  // .env 文件配置
  const envConf = loadEnv(mode, process.cwd())
  // 是否为构建
  const isBuild = command === 'build'

  return {
    // 开发服务器选项 https://cn.vitejs.dev/config/server-options
    server: {
      open: true,
      // host 为 true 时，可以被外部访问，允许 localhost 和 ip 同时进行访问
      host: true,
      port: 9529,
      proxy: {
        '/api': {
          target: 'http://192.168.31.163:8003',
          changeOrigin: true,
        },
      },
    },
    plugins: createVitePlugin(mode, isBuild),
    // 配置路径别名
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    // 构建选项 https://cn.vitejs.dev/config/build-options
    build: {
      outDir: mode === 'production' ? 'dist' : `dist-${mode}`,
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
      sourcemap: envConf.VITE_BUILD_SOURCEMAP === 'true',
    },
  }
})
