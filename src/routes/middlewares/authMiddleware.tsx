import { Outlet, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'

const AuthMiddleware = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      // 随机返回 0 或 1
      const authed = Math.round(Math.random())
      console.log('auth authed', authed)
      if (authed === 1) {
        setLoading(false)
      } else {
        // 未登录，跳转到登录页
        navigate('/login')
      }
    }, 3000)
    console.log('AuthMiddleware 中间件触发')
  }, [])

  console.log('loading', loading)

  return !loading ? <Outlet /> : 'loading...'
}

export default AuthMiddleware
