import { useEffect, useRef, useState } from 'react'

import { cn } from '@utils/index'
import './index.css'

interface AutoTooltipProps {
  text: string
  className?: string
  lines?: number // 支持的行数，默认为 1
  style?: React.CSSProperties
}

export function AutoTooltip({
  text,
  className = '',
  lines = 1,
  style = {},
}: AutoTooltipProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [overflow, setOverflow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const checkOverflow = () => {
      let isOverflow = false
      if (lines === 1) {
        // 单行：检测水平溢出
        isOverflow = el.scrollWidth > el.clientWidth
      } else {
        // 多行：检测垂直溢出
        isOverflow = el.scrollHeight > el.clientHeight
      }
      setOverflow((prev) => (prev !== isOverflow ? isOverflow : prev))
    }
    const ro = new ResizeObserver(() => checkOverflow())
    ro.observe(el)

    return () => ro.disconnect()
  }, [text, lines])

  return (
    <div
      ref={ref}
      className={cn(
        lines === 1 ? 'truncate' : 'auto-tooltip-line-clamp',
        className
      )}
      title={overflow ? text : ''}
      style={{
        ...(lines > 1 ? { WebkitLineClamp: lines } : {}),
        ...style,
      }}
    >
      {text}
    </div>
  )
}
