import { useMessage } from '@hooks'
import { useEffect } from 'react'

const Admin = () => {
  const messageApi = useMessage()

  useEffect(() => {
    setTimeout(() => {
      messageApi.success('调试全局Api')
    }, 1000)
  }, [])

  return <div>Admin</div>
}

export default Admin
