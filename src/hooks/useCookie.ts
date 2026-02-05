import { Cookie, type CookieOptions } from '@utils/index'
import { useCallback, useState } from 'react'
import { isString, isFunction } from '@utils/is'

export type State = string | undefined

export interface Options extends CookieOptions {
  // 默认值，当 cookie 不存在时使用。不会被存储到 cookie 中。
  defaultValue?: State | (() => State)
}

export const useCookie = (cookieKey: string, options: Options = {}) => {
  const [state, setState] = useState<State>(() => {
    const cookieValue = Cookie.get(cookieKey)
    if (isString(cookieValue)) {
      return cookieValue
    }

    if (isFunction(options.defaultValue)) {
      return options.defaultValue()
    }

    return options.defaultValue
  })

  const updateState = useCallback(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {}
    ) => {
      const { defaultValue, ...restOptions } = { ...options, ...newOptions }

      setState((preValue) => {
        const value = isFunction(newValue) ? newValue(preValue) : newValue
        if (value === undefined) {
          Cookie.remove(cookieKey)
        } else {
          Cookie.set(cookieKey, value, restOptions)
        }
        return value
      })
    },
    [cookieKey, options]
  )
  return [state, updateState]
}
