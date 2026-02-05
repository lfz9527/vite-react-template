import Cookies from 'js-cookie'

export type State = string | undefined

export type CookieOptions = Cookies.CookieAttributes

export interface CookieImpl {
  set(
    cookieKey: string,
    value: State,
    options?: CookieOptions
  ): string | undefined
  get(cookieKey: string): string | undefined
  remove(cookieKey: string, options?: CookieOptions): void
}

export class XTCookie implements CookieImpl {
  private options: CookieOptions = {}

  constructor(options?: CookieOptions) {
    this.options = {
      ...this.options,
      ...options,
    }
  }

  set(cookieKey: string, value: State, options: CookieOptions = {}) {
    const opt = {
      ...this.options,
      ...options,
    }

    if (value === undefined) {
      Cookies.remove(cookieKey, opt)
      return undefined
    }
    return Cookies.set(cookieKey, value, opt)
  }

  get(cookieKey: string) {
    return Cookies.get(cookieKey)
  }

  remove(cookieKey: string, options: CookieOptions = {}) {
    const opt = {
      ...this.options,
      ...options,
    }
    Cookies.remove(cookieKey, opt)
  }
}

export const Cookie = new XTCookie()
