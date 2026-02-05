import { cn } from '@utils/index'

type GridLayoutProps = {
  cols?: number
  children: React.ReactNode
}
export const GridLayout = (props: GridLayoutProps) => {
  const { cols = 2, children } = props
  const cls = cn('mt-2 grid gap-4')

  return (
    <div
      className={cls}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {children}
    </div>
  )
}
