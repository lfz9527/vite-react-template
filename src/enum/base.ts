// key的类型
type EnumKey = string | number | boolean

// JSON格式
interface EJson<V = any> {
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

  /**
   * 将枚举类转为数组
   * @param this
   * @returns
   */
  static toArray<K extends EnumKey, E extends BaseEnumCls<K>>(
    this: ClassConstructor<E>
  ): E[] {
    return Object.values(this).filter((item) => item instanceof this)
  }

  /**
   * 查找一个枚举类选项
   * @param this
   * @param key
   * @returns
   */
  static get<K extends EnumKey, E extends BaseEnumCls<K>>(
    this: ClassConstructor<E>,
    key: EnumKey
  ): E | null {
    return (this as EJson).toArray().find((item: E) => item.key === key) || null
  }

  /**
   * 通过key 获取label
   * @param this
   * @param key
   * @returns
   */
  static getLabel<K extends EnumKey, E extends BaseEnumCls<K>>(
    this: ClassConstructor<E>,
    key: K
  ): string | null {
    return (this as EJson).get(key)?.label ?? null
  }

  getKey(): K {
    return this.key
  }

  equalsKey(key: K): boolean {
    return this.key === key
  }
  /**
   * ## 判断 `Key` 是否不相等
   * @param key `Key`
   */
  notEqualsKey(key: K): boolean {
    return this.key !== key
  }
}

export default BaseEnumCls
