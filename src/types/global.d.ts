declare namespace Global {
  // 每个类型里面的字段都变成非必填，但是可以排除某些字段
  type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>
}
