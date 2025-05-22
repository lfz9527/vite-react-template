import type { PluginOption } from 'vite'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { envParse, parseLoadedEnv } from 'vite-plugin-env-parse'
import { compression } from 'vite-plugin-compression2'

const createVitePlugin = (mode: string, isBuild = false) => {
  const viteEnv = parseLoadedEnv(loadEnv(mode, process.cwd()))

  const vitePlugins: PluginOption | PluginOption[] = [
    react(),
    tailwindcss(),

    // 环境变量
    envParse({
      dtsPath: 'src/types/env.d.ts',
    }),

    // 压缩gzip格式
    isBuild &&
      viteEnv.VITE_BUILD_COMPRESS?.split(',').includes('gzip') &&
      compression(),

    // 压缩brotli格式
    isBuild &&
      viteEnv.VITE_BUILD_COMPRESS?.split(',').includes('brotli') &&
      compression({
        exclude: [/\.(br)$/, /\.(gz)$/],
        algorithm: 'brotliCompress',
      }),
  ]

  return vitePlugins
}

export default createVitePlugin
