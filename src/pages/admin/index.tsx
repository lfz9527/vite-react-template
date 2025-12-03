import { Gender } from '@/enum'
import { useEffect } from 'react'
import AutoTooltipText from '@/components/AutoTooltipText'

const Admin = () => {
  useEffect(() => {
    console.log(typeof Gender)
    Gender.get('M')

    console.log(Gender.getLabel(Gender.FEMALE.key))
  }, [])

  return (
    <div>
      Admin
      <AutoTooltipText
        text='超长文字，会自动检测是否需要 Tooltip'
        className='w-40 text-sm text-gray-700'
      />
    </div>
  )
}

export default Admin
