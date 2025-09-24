import { Outlet } from 'react-router'
import { useEffect } from 'react'

const BasicLayout = () => {
  useEffect(() => {
    console.log('BasicLayout 中间件触发')
  }, [])
  return (
    <div>
      <div>这是 BasicLayout</div>
      <Outlet />
    </div>
  )
}

export default BasicLayout
