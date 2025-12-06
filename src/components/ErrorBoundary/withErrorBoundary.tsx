import { ErrorBoundary } from './ErrorBoundary'
import { type ReactNode } from 'react'

export function WithErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode | ((error: Error, info?: React.ErrorInfo) => ReactNode)
) {
  return (props: T) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
}
