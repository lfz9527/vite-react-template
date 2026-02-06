import { useCallback, useState } from 'react'

type CopyValue = string | null

type CopyFn = (text: any) => Promise<boolean>

export const useCopyToClipboard = () => {
  const [value, setValue] = useState<CopyValue>(null)

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }
    try {
      await navigator.clipboard.writeText(text)
      setValue(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setValue(null)
      return false
    }
  }, [])

  return [value, copy]
}
