import { useState, useCallback, useEffect, useRef } from 'react'

// ==================== 类型定义 ====================
type ListData<T> = {
  list: T[]
  total: number
}

type Fn<T> = (page: number, pageSize: number) => Promise<ListData<T>>

type Options = {
  initPage?: number
  initPageSize?: number
  /** 分页变化时是否自动请求 */
  auto?: boolean
  /** 是否立即请求（首次挂载） */
  immediate?: boolean
}

// ==================== 默认值 ====================
const DEFAULT_OPTIONS: Required<Options> = {
  initPage: 1,
  initPageSize: 10,
  auto: false,
  immediate: false,
}

// ==================== Hook 实现 ====================
export function usePagination<T>(fn: Fn<T>, options?: Options) {
  const { initPage, initPageSize, auto, immediate } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  // 是否首次渲染
  const isFirstRender = useRef(true)

  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState<ListData<T>>({ list: [], total: 0 })
  const [page, setPageState] = useState(initPage)
  const [pageSize, setPageSizeState] = useState(initPageSize)

  // 加载数据
  const load = useCallback(
    async (p?: number, ps?: number) => {
      const currentPage = p ?? page
      const currentPageSize = ps ?? pageSize

      setLoading(true)
      try {
        const res = await fn(currentPage, currentPageSize)
        setListData(res)
        return res
      } finally {
        setLoading(false)
      }
    },
    [fn, page, pageSize]
  )

  // 设置页码
  const setPage = useCallback((p: number) => {
    setPageState(p)
  }, [])

  // 设置分页大小（重置到第一页）, 可选是否重置页码
  const setPageSize = useCallback(
    (ps: number, resetPage?: boolean) => {
      setPageSizeState(ps)
      if (resetPage) {
        setPageState(initPage)
      }
    },
    [initPage]
  )

  // 刷新当前页
  const refresh = useCallback(() => load(), [load])

  // 重置
  const reset = useCallback(() => {
    setPageState(initPage)
    setPageSizeState(initPageSize)
    setListData({ list: [], total: 0 })
  }, [initPage, initPageSize])

  // 首次自动加载
  useEffect(() => {
    if (immediate) {
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 分页变化自动加载（跳过首次渲染）
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (auto) {
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  return {
    // 状态
    list: listData.list,
    total: listData.total,
    page,
    pageSize,
    loading,
    // 方法
    setPage,
    setPageSize,
    refresh,
    reset,
    load,
  }
}

const testFetch = ({
  page,
  pageSize,
}: {
  page: number
  pageSize: number
}): Promise<Global.Response<ListData<{ index: number }>>> => {
  return new Promise((resolve) => {
    console.log(page, pageSize)
    // 模拟异步请求
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          list: [{ index: 1 }],
          total: 1,
        },
        message: 'success',
      })
    }, 1000)
  })
}

export const UsePaginationExample = () => {
  const { list } = usePagination<{
    index: number
  }>(async (page, pageSize) => {
    const res = await testFetch({ page, pageSize })
    return res.data
  })

  return (
    <>
      <ul>
        {list.map((v) => (
          <li key={v.index}>{v.index}</li>
        ))}
      </ul>
    </>
  )
}
