import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
// 类名合并
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/**
 * 接受单个值或数组，并且始终返回数组。
 * @param i
 * @returns
 */
export function toArray<T = string>(i: T | T[]) {
  return ([] as T[]).concat(i)
}
