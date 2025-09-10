import { Button } from 'antd'
import { getVipGetVipPackageByOpen } from '@/service/api'

const Login = () => {
  return (
    <>
      <div
        style={{
          background: 'red',
        }}
      >
        Login
      </div>
      <Button
        onClick={async () => {
          try {
            const { data } = await getVipGetVipPackageByOpen()
            console.log(111, data)
          } catch (error) {
            console.log('最外层的捕获', error)
          }
        }}
      >
        测试封装的fetch请求
      </Button>
    </>
  )
}

export default Login
