import { UsePaginationExample } from '@/hooks'
import { FetchDemo } from './service/api'

import { AutoTooltip } from '@components/AutoTooltip'

import { cn } from '@utils/index'

type GridLayoutProps = {
  cols?: number
  children: React.ReactNode
}
const GridLayout = (props: GridLayoutProps) => {
  const { cols = 2, children } = props
  const cls = cn('mt-2 grid gap-4')

  return (
    <div
      className={cls}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {children}
    </div>
  )
}

type ExampleProps = {
  title?: string
  children: React.ReactNode
}
const Example = (props: ExampleProps) => {
  const { title = '测试模板示例', children } = props
  return (
    <div className='p-2'>
      <h1 className='pb-2 text-2xl font-bold'>{title}</h1>
      <div className='mt-2'>{children}</div>
    </div>
  )
}

type CardProps = {
  children: React.ReactNode
  title?: string
}
const Card = ({ children, title }: CardProps) => {
  return (
    <div className='rounded-md bg-white p-4 shadow-[0_0_6px_rgba(0,0,0,0.08),0_0_16px_rgba(0,0,0,0.06)]'>
      {title && <h2 className='mb-2 text-lg font-bold'>{title}</h2>}
      {children}
    </div>
  )
}

const End = () => {
  return (
    <div className='py-10'>
      <hr />
    </div>
  )
}

export const TemExample = () => {
  const _fetchDemo = async () => {
    const res = await FetchDemo()
    console.log(res.data)
  }

  return (
    <>
      <Example title='测试分页管理 usePagination'>
        <UsePaginationExample />
      </Example>
      <hr />

      <Example title='测试 AutoTooltip 组件'>
        <GridLayout cols={3}>
          <Card title='AutoTooltip 组件'>
            <AutoTooltip
              text='超长文字，会自动检测是否需要 Tooltip'
              className='w-40 text-sm text-gray-700'
            />
          </Card>
          <Card title='AutoTooltip 组件'>
            <AutoTooltip
              text='超长文字，会自动检测是否需要 Tooltip'
              className='w-40 text-sm text-gray-700'
            />
          </Card>
          <Card title='AutoTooltip 组件'>
            <AutoTooltip
              text='超长文字，会自动检测是否需要 Tooltip'
              className='w-40 text-sm text-gray-700'
            />
          </Card>
        </GridLayout>
      </Example>

      <End />
    </>
  )
}
