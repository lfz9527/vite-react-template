import throttleFunction from 'throttleit'

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  waitMs: number | undefined
): T {
  return waitMs != null ? throttleFunction(fn, waitMs) : fn
}

/**
 * 使用ReadableStream，直到完全读取为止。
 *
 * 该函数逐块读取流，直到流耗尽。
 * 它不处理或返回流中的数据;它只是确保
 * 整个流都被读取。
 *
 * @param {ReadableStream} stream -要消费的ReadableStream。
 * @ reports {Promise<void>}流完全消耗时解决的Promise。
 */
export async function consumeStream({
  stream,
  onError,
}: {
  stream: ReadableStream
  onError?: (error: Error) => void
}): Promise<void> {
  const reader = stream.getReader()
  try {
    while (true) {
      const { done } = await reader.read()
      if (done) break
    }
  } catch (error: any) {
    onError?.(error)
  } finally {
    reader.releaseLock()
  }
}
