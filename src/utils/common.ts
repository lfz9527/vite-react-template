// 类名合并
export const cn = (
  ...classes: (string | boolean | undefined | null)[]
): string => classes.filter(Boolean).join(' ')
