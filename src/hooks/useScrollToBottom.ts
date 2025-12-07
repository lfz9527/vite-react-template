import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  // 距离底部多少像素内认为“已到底”
  threshold?: number
  // 是否根据内容变化自动滚动到底部
  autoScroll?: boolean
}

/**
 *
 * @returns 滚动到底部
 */
export const useScrollToBottom = ({
  threshold = 100,
  autoScroll = true,
}: Props) => {
  // 指向可滚动容器的 DOM。
  const containerRef = useRef<HTMLDivElement>(null)
  // 指向容器底部的占位节点（可选，用于滚动锚点）。
  const endRef = useRef<HTMLDivElement>(null)
  // 标记容器是否滚动到底部。
  const [isAtBottom, setIsAtBottom] = useState(true)
  // 用来同步最新值，
  const isAtBottomRef = useRef(true)
  // 标记用户是否正在滚动，避免自动滚动干扰用户操作。
  const isUserScrollingRef = useRef(false)

  useEffect(() => {
    isAtBottomRef.current = isAtBottom
  }, [isAtBottom])

  // 判断是否在底部
  const checkIfAtBottom = () => {
    if (!containerRef.current) {
      return true
    }
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    return scrollTop + clientHeight >= scrollHeight - threshold
  }

  // 滚动到底部
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!containerRef.current) return
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior,
    })
  }, [])

  // 处理用户滚动事件
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    let scrollTimeout: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      // 标记用户正在滚动
      isUserScrollingRef.current = true
      clearTimeout(scrollTimeout)

      // 更新滚动到底部的状态
      const atBottom = checkIfAtBottom()
      setIsAtBottom(atBottom)
      isAtBottomRef.current = atBottom

      // 滚动结束后重置用户滚动标志
      scrollTimeout = setTimeout(() => {
        isUserScrollingRef.current = false
      }, 150)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  // 当容器内容变化或尺寸变化时，如果之前在底部且用户没有手动滚动，则自动滚动到底
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    if (!autoScroll) return

    const scrollIfNeeded = () => {
      if (isAtBottomRef.current && !isUserScrollingRef.current) {
        // 确保滚动在下一帧执行，避免布局抖动。
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'instant',
          })
          setIsAtBottom(true)
          isAtBottomRef.current = true
        })
      }
    }
    // 监听 DOM 节点增删改。
    const mutationObserver = new MutationObserver(scrollIfNeeded)
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    // 监听容器或子元素尺寸变化。
    const resizeObserver = new ResizeObserver(scrollIfNeeded)
    resizeObserver.observe(container)
    for (const child of container.children) {
      resizeObserver.observe(child)
    }
    return () => {
      mutationObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [autoScroll])

  // 手动控制是否进入底部
  const onViewportEnter = () => {
    setIsAtBottom(true)
    isAtBottomRef.current = true
  }

  // 是否离开底部
  const onViewportLeave = () => {
    setIsAtBottom(false)
    isAtBottomRef.current = false
  }

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
  }
}

export default useScrollToBottom
