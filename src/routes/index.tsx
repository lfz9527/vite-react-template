import { RouteErrorBoundary } from '@components/ErrorBoundary'
import { buildRoutes, type RouteConfig } from './utils'
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

const routes: RouteConfig[] = [
  {
    element: lazy(() => import('@/layouts/root')),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: lazy(() => import('@layouts/basic-layout')),
        middlewares: [lazy(() => import('./middlewares/auth-middleware'))],
        children: [
          {
            path: '/',
            element: lazy(() => import('@/pages/admin/index')),
          },
        ],
      },
      {
        path: '/login',
        element: lazy(() => import('@/pages/login/index')),
      },
    ],
  },
]

export const router = createBrowserRouter(buildRoutes(routes))
