import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
// 类名合并
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
