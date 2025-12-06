import { ErrorBoundary } from './ErrorBoundary'
import { type ReactNode } from 'react'

function WithErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return (props: T) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
}

export default WithErrorBoundary
