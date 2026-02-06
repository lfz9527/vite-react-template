import { RouterProvider } from 'react-router'

import { router } from './routes'

import { TemExample } from './example'

const App = () => {
  return (
    <>
      <h1> 路由</h1>
      <ul className='flex flex-col gap-4 pb-10 pl-10'>
        <li>
          <a href='/'>首页</a>
        </li>
        <li>
          <a href='/admin'>admin page</a>
        </li>
        <li>
          <a href='/login'>login page</a>
        </li>
        <li>
          <a href='/404'>404</a>
        </li>
      </ul>

      <RouterProvider router={router} />
      {import.meta.env.DEV && <TemExample />}
    </>
  )
}

export default App
