import { RouteObject } from 'react-router'
import { ComponentType, LazyExoticComponent } from 'react'
import LazyImport from '@components/LazyImport'

export type LazyComponent = LazyExoticComponent<ComponentType>

export type RouteConfig = Omit<
  RouteObject,
  'element' | 'children' | 'Component' | 'lazy'
> & {
  element: LazyComponent
  middlewares?: LazyComponent[]
  children?: RouteConfig[]
}

export const buildRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map((route) => {
    const { element, middlewares, children, ...res } = route

    // 要返回的路由对象
    let routeObject: RouteObject = {
      ...res,
    }

    // 递归构建子路由
    if (children) {
      routeObject.children = buildRoutes(children)
    }

    // 异步加载组件
    routeObject.element = <LazyImport lazy={element} />

    // 中间件处理
    if (middlewares && middlewares.length > 0) {
      // 从后往前遍历中间件，这样中间件的执行顺序就是从前往后
      for (let i = middlewares.length - 1; i >= 0; i--) {
        const middleware = middlewares[i]
        routeObject = {
          element: <LazyImport lazy={middleware} />,
          children: [routeObject],
        }
      }
    }

    // 返回路由对象
    return routeObject
  })
}
