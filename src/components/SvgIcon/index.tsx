export interface SvgIconProps {
  prefix?: string
  style?: React.CSSProperties
  className?: string
  name: string
  size?: number
  width?: number
  height?: number
  color?: string
}

const SvgIcon: React.FC<SvgIconProps> = (props) => {
  const {
    className,
    name,
    prefix = 'icon',
    style = {},
    size = 28,
    width = size,
    height = size,
    color = '#000',
  } = props
  const symbolId = `#${prefix}-${name}`
  return (
    <svg
      className={className}
      aria-hidden="true"
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        ...style,
      }}
    >
      <use href={symbolId} />
    </svg>
  )
}

export default SvgIcon
