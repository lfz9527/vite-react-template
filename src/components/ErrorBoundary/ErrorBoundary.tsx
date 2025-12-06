import React, { type ReactNode } from 'react'

interface Props {
  fallback?: ReactNode | ((error: Error, info?: React.ErrorInfo) => ReactNode)
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: undefined,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // 保存 errorInfo
    this.setState({ errorInfo: info })

    // 这里做你的埋点上报
    console.error('ErrorBoundary 捕获错误：', error, info)
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props
      if (typeof fallback === 'function') {
        return fallback(this.state.error!, this.state.errorInfo)
      }
      return fallback ?? <>出错了！！</>
    }
    return this.props.children
  }
}
