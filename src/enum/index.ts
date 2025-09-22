import BaseEnumCls from './base'

export class Gender extends BaseEnumCls<string> {
  static readonly MALE = new Gender('M', '男')
  static readonly FEMALE = new Gender('F', '女')
}

console.log('===', Gender.MALE.getKey())
