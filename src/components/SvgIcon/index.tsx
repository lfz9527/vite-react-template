import { cn } from '@/utils'

export interface SvgIconProps {
  prefix?: string
  style?: React.CSSProperties
  className?: string
  name: string
  size?: number
  color?: string
}

const SvgIcon = (props: SvgIconProps) => {
  const {
    className,
    name,
    prefix = 'icon',
    style = {},
    size = 28,
    color = '#000',
  } = props

  const symbolId = `#${prefix}-${name}`
  return (
    <svg
      className={cn(`flex-center`, className)}
      aria-hidden='true'
      style={{
        width: size,
        height: size,
        color,
        ...style,
      }}
    >
      <use href={symbolId} />
    </svg>
  )
}

export default SvgIcon
