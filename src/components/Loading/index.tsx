import { cn } from '@/utils'
import SvgIcon, { type SvgIconProps } from '@components/SvgIcon'

type LoadingProps = {
  className?: string
  iconProps?: Partial<Omit<SvgIconProps, 'name'>>
}

const Loading = ({ className, iconProps }: LoadingProps) => {
  return (
    <div className={cn('flex-center', className)}>
      <SvgIcon
        {...iconProps}
        name='loading'
      />
    </div>
  )
}

export default Loading
