type ExampleProps = {
  title?: string
  children: React.ReactNode
}
export const ExampleLayout = (props: ExampleProps) => {
  const { title = '测试模板示例', children } = props
  return (
    <div className='p-3'>
      <h1 className='pb-2 text-2xl font-bold'>{title}</h1>
      <div className='mt-2'>{children}</div>
    </div>
  )
}

type CardProps = {
  children: React.ReactNode
  title?: string
}
export const ExampleLayCard = ({ children, title }: CardProps) => {
  return (
    <div className='rounded-md bg-white p-4 shadow-[0_0_6px_rgba(0,0,0,0.08),0_0_16px_rgba(0,0,0,0.06)]'>
      {title && <h2 className='mb-2 text-lg font-bold'>{title}</h2>}
      {children}
    </div>
  )
}

export const ExampleEnd = () => {
  return (
    <div className='py-10'>
      <hr />
    </div>
  )
}
