import { useEffect, useMemo } from 'react'
import { isFunction, toArray } from '@utils/index'
import { useLatest } from '@/hooks'

type noop = (...p: any) => void

type TargetType = HTMLElement | Element | Window | Document

type Target = Global.BasicTarget<TargetType>

type Options<T extends Target = Target> = {
  target?: T
  capture?: boolean
  once?: boolean
  passive?: boolean
  enable?: boolean
}

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>
): void
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>
): void
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>
): void
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>
): void
function useEventListener(
  eventName: string | string[],
  handler: (event: Event) => void,
  options?: Options<Window>
): void
function useEventListener(
  eventName: string | string[],
  handler: noop,
  options: Options
): void

function useEventListener(
  eventName: string | string[],
  handler: noop,
  options: Options = {}
) {
  const {
    target,
    capture = false,
    once = false,
    passive = false,
    enable = true,
  } = options
  const handlerRef = useLatest(handler)

  const eventNames = useMemo(() => toArray(eventName), [eventName])

  useEffect(() => {
    if (!enable) {
      return
    }
    const targetElement = getTargetElement(target, window)
    if (!targetElement?.addEventListener) return

    const eventListener = (event: Event) => handlerRef.current(event)

    eventNames.forEach((event) => {
      targetElement.addEventListener(event, eventListener, {
        capture,
        once,
        passive,
      })
    })
    return () => {
      eventNames.forEach((event) => {
        targetElement.removeEventListener(event, eventListener, { capture })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventNames, target, capture, once, passive, enable])
}
export default useEventListener

function getTargetElement<T extends TargetType>(
  target: Global.BasicTarget<T>,
  defaultElement?: T
) {
  if (!target) {
    return defaultElement
  }

  let targetElement: T | undefined | null

  if (isFunction(target)) {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }
  return targetElement
}
