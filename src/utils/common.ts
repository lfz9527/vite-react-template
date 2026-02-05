import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
// 类名合并
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/**
 * 复制文本到剪贴板
 * @param text
 * @returns
 */
export const clipboard = (text: string | number) => {
  return new Promise((resolve, reject) => {
    if (!navigator?.clipboard?.writeText) {
      reject()
    }
    navigator.clipboard
      .writeText(text.toString())
      .then(() => {
        resolve(true)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
