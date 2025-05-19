// 本地存储工具类

type StorageType = 'localStorage' | 'sessionStorage'

interface StorageItem {
  // 数据
  data: any
  // 过期时间
  expire: number
  // 创建时间
  createTime: number
}

/**
 *
 */
class Storage {
  private storage: globalThis.Storage

  constructor(type: StorageType) {
    this.storage = window[type]
  }

  public async setItem(key: string, item: StorageItem) {
    const data = {
      expire: 0,
      createTime: Date.now(),
      ...item.data,
    }
    await this.storage.setItem(key, JSON.stringify(data))
  }

  public async getItem(key: string): Promise<StorageItem | null> {
    const item = await this.storage.getItem(key)
    if (!item) return null
    const { data, expire, createTime } = JSON.parse(item)
    // 过期时间小于当前时间，则删除
    if (expire >= 0 && Date.now() - createTime > expire) {
      await this.storage.removeItem(key)
      return null
    }
    return { data, expire, createTime }
  }

  public async removeItem(key: string) {
    await this.storage.removeItem(key)
  }
}

export const localStore = new Storage('localStorage')
export const sessionStore = new Storage('sessionStorage')
