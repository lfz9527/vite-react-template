import { usePagination, type ListData } from '@/hooks'
type Data = {
  index: number
  createTime: number
}
const testFetch = ({
  page,
  pageSize,
}: {
  page: number
  pageSize: number
}): Promise<Global.Response<ListData<Data>>> => {
  return new Promise((resolve) => {
    const list = new Array(100).fill(0).map((_, i) => ({
      index: i + 1,
      createTime: Date.now(),
    }))

    // 模拟异步请求
    setTimeout(() => {
      console.log('模拟异步请求')
      resolve({
        code: 0,
        data: {
          list: list.slice((page - 1) * pageSize, page * pageSize),
          total: list.length,
        },
        message: 'success',
      })
    }, 1000)
  })
}

export const UsePaginationExample = () => {
  const {
    list,
    total,
    page,
    pageSize,
    loading,
    setPage,
    setPageSize,
    refresh,
    reset,
    load,
  } = usePagination<Data>(
    async (page, pageSize) => {
      const res = await testFetch({ page, pageSize })
      return res.data
    },
    {
      auto: true,
      immediate: true,
    }
  )

  const btnClassName =
    'rounded-md border-1 px-2 py-1 cursor-pointer hover:bg-slate-100'

  return (
    <>
      {loading ? '加载中...' : ''}

      <>
        <div>
          <div>
            <span>当前页：{page}</span>
            <span>当前分页大小：{pageSize}</span>
          </div>
          <div>
            <span>总页数：{Math.ceil(total / pageSize)}</span>
            <span>总数据量：{total}</span>
          </div>
        </div>
        <ul>
          {list.map((v) => (
            <li key={v.index + v.createTime}>
              {v.index}-{v.createTime}
            </li>
          ))}
        </ul>
        <div className='flex items-center gap-2'>
          <button
            className={btnClassName}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </button>
          <button
            className={btnClassName}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </button>
          <button
            className={btnClassName}
            onClick={() => setPageSize(pageSize * 2, true)}
          >
            分页大小 * 2
          </button>
          <button
            className={btnClassName}
            onClick={refresh}
          >
            刷新当前页
          </button>
          <button
            className={btnClassName}
            onClick={reset}
          >
            重置
          </button>
          <button
            className={btnClassName}
            onClick={() => load()}
          >
            手动加载
          </button>
        </div>
      </>
    </>
  )
}
