import { RouteObject } from 'react-router'
import { ComponentType, LazyExoticComponent, ReactElement } from 'react'
import LazyImport from '@/components/LazyImport'

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

export const buildRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map((route) => {
    const { element, Component, middlewares = [], children, ...res } = route

    // 要返回的路由对象
    let routeObject: RouteObject = {
      ...res,
    }

    // 递归构建子路由
    if (children && children.length > 0) {
      routeObject.children = buildRoutes(children)
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
