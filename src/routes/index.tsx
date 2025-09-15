import { createBrowserRouter } from 'react-router'
import { buildRoutes, RouteConfig } from './utils'
import { lazy } from 'react'

const routes: RouteConfig[] = [
  {
    element: lazy(() => import('@/layouts/index')),
    middlewares: [
      lazy(() => import('./middlewares/authMiddleware')),
      lazy(() => import('./middlewares/authMiddleware1')),
    ],
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
]

export const router = createBrowserRouter(buildRoutes(routes))
