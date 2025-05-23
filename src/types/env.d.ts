/// <reference types="vite/client" />

declare module 'virtual:svg-icons-register' {
  const content: any
  export default content
}
declare module 'virtual:svg-icons-names' {
  const iconsNames: string[]
  export default iconsNames
}

// 通过 envParse 生成的变量
interface ImportMetaEnv {
  // Auto generate by env-parse
  /**
   * 是否在打包时生成 sourcemap
   */
  readonly VITE_BUILD_SOURCEMAP: boolean
  /**
   * 是否在打包时开启压缩，支持 gzip 和 brotli
   */
  readonly VITE_BUILD_COMPRESS: string
}
