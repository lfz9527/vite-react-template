import { UsePaginationExample } from './UsePaginationExample'
import { FetchDemo } from '@/service/api'

import { AutoTooltip } from '@components/AutoTooltip'

import { GridLayout } from './components/GridLayout'
import {
  ExampleLayout,
  ExampleLayCard,
  ExampleEnd,
} from './components/ExampleLayout'

export const TemExample = () => {
  const _fetchDemo = async () => {
    const res = await FetchDemo()
    console.log(res.data)
  }

  return (
    <>
      <ExampleLayout title='测试分页管理 usePagination'>
        <UsePaginationExample />
      </ExampleLayout>
      <hr />

      <ExampleLayout title='测试 AutoTooltip 组件'>
        <GridLayout cols={2}>
          <ExampleLayCard title='AutoTooltip 组件 默认一行'>
            <AutoTooltip
              text='超长文字，会自动检测是否需要 Tooltip'
              className='w-40 text-sm text-gray-700'
            />
          </ExampleLayCard>
          <ExampleLayCard title='AutoTooltip 组件 多行'>
            <AutoTooltip
              text='多行超长文字多行超长文字多行超长文字多行超长文字多行超长文字多行超长文字多行超长文字，会自动检测是否需要 Tooltip'
              lines={3}
              className='w-40 text-sm text-gray-700'
            />
          </ExampleLayCard>
        </GridLayout>
      </ExampleLayout>

      <ExampleEnd />
    </>
  )
}
