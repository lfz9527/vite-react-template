import { Outlet } from 'react-router'
import { useEffect } from 'react'

const AuthMiddleware = () => {
  useEffect(() => {
    console.log('AuthMiddleware 中间件触发')
  }, [])

  return <Outlet />
}

export default AuthMiddleware
