import LazyImport from '@/components/LazyImport'
import {
  type ComponentType,
  type LazyExoticComponent,
  type ReactElement,
} from 'react'
import { type RouteObject } from 'react-router'

// 懒加载组件类型
export type LazyComponent = LazyExoticComponent<ComponentType>

// 普通React组件类型
export type RegularComponent = ComponentType<any>

// React元素类型
export type RouteElement = ReactElement | null

// 支持的组件类型：懒加载组件、普通组件、React元素
export type SupportedComponent = LazyComponent | RegularComponent | RouteElement

// 路由配置类型
export type RouteConfig = Omit<
  RouteObject,
  'element' | 'children' | 'Component' | 'lazy'
> & {
  element?: SupportedComponent
  Component?: SupportedComponent // 兼容React Router的Component属性
  middlewares?: (LazyComponent | RegularComponent)[]
  children?: RouteConfig[]
  // 环境过滤配置
  env?: string[] // 指定路由在哪些环境下可用，未配置则不受影响
}

// 判断是否是懒加载组件
const isLazyComponent = (component: any): component is LazyComponent => {
  return (
    typeof component === 'object' &&
    component !== null &&
    '$$typeof' in component &&
    component['$$typeof'] === Symbol.for('react.lazy')
  )
}

// 判断是否是普通组件（函数组件或类组件）
const isRegularComponent = (component: any): component is RegularComponent => {
  return typeof component === 'function'
}

// 判断是否是React元素
const isReactElement = (component: any): component is ReactElement => {
  return (
    typeof component === 'object' &&
    component !== null &&
    '$$typeof' in component &&
    (component['$$typeof'] === Symbol.for('react.element') ||
      component['$$typeof'] === Symbol.for('react.fragment'))
  )
}

// 将组件转换为React元素
const componentToElement = (
  component: SupportedComponent
): ReactElement | null => {
  if (component === null || component === undefined) {
    return null
  }

  // 如果已经是React元素，直接返回
  if (isReactElement(component)) {
    return component
  }

  // 如果是懒加载组件，用LazyImport包装
  if (isLazyComponent(component)) {
    return <LazyImport lazy={component} />
  }

  // 如果是普通组件，直接渲染
  if (isRegularComponent(component)) {
    const Component = component as ComponentType
    return <Component />
  }

  return null
}

// 获取当前环境
const getCurrentEnvironment = (): string => {
  // 优先使用 VITE_APP_ENV，其次使用 mode，最后使用 NODE_ENV
  return import.meta.env.MODE || import.meta.env.NODE_ENV || 'development'
}

// 检查路由是否应该在当前环境下可用
const shouldIncludeRoute = (route: RouteConfig): boolean => {
  // 如果没有配置 env，则不受影响（默认可用）
  if (!route.env || route.env.length === 0) {
    return true
  }

  const currentEnv = getCurrentEnvironment()
  // 如果当前环境包含在 env 数组中，则构建该路由
  return route.env.includes(currentEnv)
}

export const buildRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes
    .filter(shouldIncludeRoute) // 环境过滤
    .map((route) => {
      const { element, Component, middlewares = [], children, ...res } = route

      // 要返回的路由对象
      let routeObject: RouteObject = {
        ...res,
      }

      // 递归构建子路由（子路由也会应用环境过滤）
      if (children && children.length > 0) {
        const filteredChildren = buildRoutes(children)
        // 只有在过滤后还有子路由时才设置 children
        if (filteredChildren.length > 0) {
          routeObject.children = filteredChildren
        }
      }

      // 确定要使用的组件（优先使用element，其次是Component）
      const targetComponent = element || Component

      // 转换组件为React元素
      if (targetComponent) {
        routeObject.element = componentToElement(targetComponent)
      }

      // 中间件处理
      if (middlewares && middlewares.length > 0) {
        // 从后往前遍历中间件，这样中间件的执行顺序就是从前往后
        for (let i = middlewares.length - 1; i >= 0; i--) {
          const middleware = middlewares[i]
          const middlewareElement = componentToElement(middleware)

          if (middlewareElement) {
            routeObject = {
              element: middlewareElement,
              children: [routeObject],
            }
          }
        }
      }

      return routeObject
    })
}
