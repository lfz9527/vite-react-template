// 本地存储工具类

type StorageType = 'localStorage' | 'sessionStorage'

/**
 *
 */
class Storage {
  private storage: globalThis.Storage

  constructor(type: StorageType) {
    this.storage = window[type]
  }

  public setItem(key: string, value: any) {
    this.storage.setItem(key, value)
  }

  public getItem(key: string) {
    return this.storage.getItem(key)
  }

  public removeItem(key: string) {
    this.storage.removeItem(key)
  }
}

export const localStore = new Storage('localStorage')
export const sessionStore = new Storage('sessionStorage')
