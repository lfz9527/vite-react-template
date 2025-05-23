import { getApi, postApi, getApi2 } from './service/api'

const ButtonStyle = {
  margin: '10px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: 'blue',
  color: 'white',
}

const App = () => {
  const handlePostClick = () => {
    postApi({
      testTitle: '测试post',
      testTime: Date.now(),
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(1111, err.message)
      })
  }
  const handleGetClick2 = () => {
    getApi2()
      .then((res) => {
        console.log(2222, res)
      })
      .catch((err) => {
        console.log(1111, err)
      })
  }
  const handleGetClick = () => {
    getApi()
      .then((res) => {
        console.log(2222, res)
      })
      .catch((err) => {
        console.log(1111, err)
      })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500">
        Hello World Vite React Template{' '}
      </h1>
      <button
        style={ButtonStyle}
        onClick={handlePostClick}
      >
        post 请求
      </button>
      <button
        style={ButtonStyle}
        onClick={handleGetClick}
      >
        get 请求
      </button>
      <button
        style={ButtonStyle}
        onClick={handleGetClick2}
      >
        get 请求2模拟系统错误
      </button>
    </div>
  )
}
export default App
