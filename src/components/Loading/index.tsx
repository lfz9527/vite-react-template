import { Spin } from 'antd'
import cs from 'classnames'

interface LoadingProps {
  className?: string
}

const Loading = (props: LoadingProps) => {
  const { className } = props
  const classNames = cs('flex items-center justify-center h-screen', className)
  return (
    <div className={classNames}>
      <Spin />
    </div>
  )
}

export default Loading
