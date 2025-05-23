import { Outlet } from 'react-router'

const BasicLayout = () => {
  console.log('触发 basic layouts')
  return (
    <div>
      <div>这是 BasicLayout</div>
      <Outlet />
    </div>
  )
}

export default BasicLayout
