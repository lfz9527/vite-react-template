import { Outlet, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import Loading from '@components/Loading'

const AuthMiddleware = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('AuthMiddleware 中间件触发')
    setTimeout(() => {
      // 随机返回 0 或 1
      const authed = Math.round(Math.random())
      if (authed === 1) {
        setLoading(false)
      } else {
        // 未登录，跳转到登录页
        navigate('/login')
      }
    }, 1000)
  }, [])
  console.log('loading', loading)
  return !loading ? <Outlet /> : <Loading />
}

export default AuthMiddleware
