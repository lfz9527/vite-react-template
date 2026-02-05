import { RouterProvider } from 'react-router'

import { router } from './routes'

import { TemExample } from './example'

const App = () => {
  return (
    <>
      {import.meta.env.DEV && <TemExample />}
      <RouterProvider router={router} />
    </>
  )
}

export default App
