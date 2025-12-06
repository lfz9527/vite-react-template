import React, { type ReactNode } from 'react'
import GlobalCrash from './GlobalCrash'

interface Props {
  fallback?: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // 在这里做你的埋点上报
    console.error('ErrorBoundary 捕获错误：', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <GlobalCrash />
    }
    return this.props.children
  }
}
