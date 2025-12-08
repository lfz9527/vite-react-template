export type Role = 'user' | 'ai'

export type DataTypes = Record<string, unknown>

// 消息的chunk 数据
export type UIMessageChunk<T = Record<string, unknown>> = {
  Msg: string
  Code: number
  Data: string | T
}

// 元数据
export type METADATA<M = Record<string, unknown>> = UIMessageChunk<M>

export interface UIMessage<M = unknown> {
  // 唯一的消息id
  id: string
  // 消息所属角色,
  role: Role
  // 元消息数组
  metadata: METADATA<M>[]
  // 消息部分
  parts: UIMessagePart[]
}

export type UIMessagePart = TextUIPart | FileUIPart | ToolUIPart

/**
 * 消息的文本部分。
 */
export type TextUIPart = {
  type: 'text'

  /**
   * 文本内容
   */
  text: string

  /**
   * 内容状态
   */
  state?: 'streaming' | 'done' | 'error'
}

/**
 * 消息的文件部分
 */
export type FileUIPart = {
  type: 'file'
  /**
   * 文件mime 类型
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string

  /**
   * 文件名称
   */
  filename?: string

  /**
   * 文件链接
   */
  url: string
}

export type ToolUIPart = {
  type: 'tool'

  /**
   * 工具id
   */
  toolId: string

  /**
   * 工具名
   */
  toolName: string
}

export function isTextUIPart(part: UIMessagePart): part is TextUIPart {
  return part.type === 'text'
}
