type DateToken = 'YYYY' | 'MM' | 'DD' | 'HH' | 'mm' | 'ss'

/**
 * 格式化日期
 * @param date 默认为当前
 * @param formatStr 默认为 YYYY-MM-DD HH:mm:ss
 * @returns
 */
export function formatDate(
  date?: Date | string | number,
  formatStr?: string
): string {
  const time = new Date(date ? date : Date.now())
  const format: string = formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss'
  const map: Record<DateToken, string> = {
    YYYY: String(time.getFullYear()),
    MM: String(time.getMonth() + 1).padStart(2, '0'),
    DD: String(time.getDate()).padStart(2, '0'),
    HH: String(time.getHours()).padStart(2, '0'),
    mm: String(time.getMinutes()).padStart(2, '0'),
    ss: String(time.getSeconds()).padStart(2, '0'),
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (t) => map[t as DateToken])
}
