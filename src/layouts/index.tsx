import { useEffect } from 'react'
import { Outlet } from 'react-router'

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
