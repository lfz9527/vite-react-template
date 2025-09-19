import { defineConfig, loadEnv } from 'vite'
import createVitePlugin from './vite/plugin'

export default defineConfig(({ mode, command }) => {
  // .env 文件配置
  const envConf = loadEnv(mode, process.cwd())
  // 是否为构建
  const isBuild = command === 'build'

  return {
    // 开发服务器选项 https://cn.vitejs.dev/config/server-options
    server: {
      open: true,
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
    // 构建选项 https://cn.vitejs.dev/config/build-options
    build: {
      outDir: `output/dist-${mode}`,
      terserOptions: {
        compress: {
          drop_console: true, // 删除所有 console.*
          drop_debugger: true, // 删除 debugger
        },
      },
      // 自定义资源的输出目录
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
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
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
      sourcemap: envConf.VITE_BUILD_SOURCEMAP === 'true',
    },
  }
})
