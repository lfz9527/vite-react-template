import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { logger } from './loggerMiddleware'

type State = {
  token: string
}

type Action = {
  setToken: (token: State['token']) => void
}

const useAuthor = create<State & Action>()(
  logger(
    devtools(
      persist(
        (set) => ({
          token: '',
          setToken: (token: State['token']) => {
            set({ token })
          },
        }),
        {
          name: 'app-author',
          storage: createJSONStorage(() => sessionStorage),
        }
      ),
      { name: 'useAuthor' }
    )
  )
)
export default useAuthor
