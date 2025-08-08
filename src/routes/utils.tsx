import { RouteObject } from 'react-router'
import { ComponentType, LazyExoticComponent, ReactElement } from 'react'
import LazyImport from '@/components/LazyImport'

export type LazyComponent = LazyExoticComponent<ComponentType>

export type RouteElement = ReactElement | null

export type RouteConfig = Omit<
  RouteObject,
  'element' | 'children' | 'Component' | 'lazy'
> & {
  element: LazyComponent | RouteElement
  middlewares?: LazyComponent[]
  children?: RouteConfig[]
}

// 判断是否是懒加载组件
const isLazyComponent = (
  element: LazyComponent | RouteElement
): element is LazyComponent => {
  return (
    typeof element === 'object' &&
    element !== null &&
    '$$typeof' in element &&
    (element as any)['$$typeof'] === Symbol.for('react.lazy')
  )
}

export const buildRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map((route) => {
    const { element, middlewares, children, ...res } = route

    // 要返回的路由对象
    let routeObject: RouteObject = {
      ...res,
    }

    // 递归构建子路由
    if (children && children.length > 0) {
      routeObject.children = buildRoutes(children)
    }

    // 加载组件
    routeObject.element = isLazyComponent(element) ? (
      <LazyImport lazy={element} />
    ) : (
      element
    )

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
