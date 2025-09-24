import { useEffect } from 'react'
import { Outlet } from 'react-router'

const AuthMiddleware = () => {
  useEffect(() => {
    console.log('AuthMiddleware1 中间件触发')
  }, [])

  return <Outlet />
}

export default AuthMiddleware
