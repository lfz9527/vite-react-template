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

/**
 * 接受单个值或数组，并且始终返回数组。
 * @param i
 * @returns
 */
export function toArray<T = string>(i: T | T[]) {
  return ([] as T[]).concat(i)
}
