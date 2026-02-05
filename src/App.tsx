import { RouterProvider } from 'react-router'

import { router } from './routes'

import { TemExample } from './TemExample'

const App = () => {
  return (
    <>
      <TemExample />
      <RouterProvider router={router} />
    </>
  )
}

export default App
