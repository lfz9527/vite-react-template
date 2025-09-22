type EnumKey = string | number | boolean

interface EJson<V = any> {
  /**
   * ### `JSON` 的键
   */
  [x: string]: V
}

/**
 * # 类包装
 */
export type ClassConstructor<T = any> = {
  new (...args: any[]): T
}

export interface EnumDic<K extends EnumKey = EnumKey> {
  // 字典的值
  key: K
  // 字典的显示标题
  label: string
}

// 枚举类
abstract class BaseEnumCls<K extends EnumKey = string> implements EnumDic<K> {
  readonly key: K
  readonly label: string

  constructor(key: K, label: string) {
    this.key = key
    this.label = label
  }

  static toArray<K extends EnumKey, E extends BaseEnumCls<K>>(
    this: ClassConstructor<E>
  ): E[] {
    return Object.values(this).filter((item) => item instanceof this)
  }

  static get<K extends EnumKey, E extends BaseEnumCls<K>>(
    this: ClassConstructor<K>,
    key: EnumKey
  ): E | null {
    return (this as EJson).toArray().find((item: E) => item.key === key) || null
  }

  getKey(): K {
    return this.key
  }

  equalsKey(key: EnumKey): boolean {
    return this.key === key
  }
}

export default BaseEnumCls
