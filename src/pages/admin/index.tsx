import { Gender } from '@/enum'
import { useEffect } from 'react'

const Admin = () => {
  useEffect(() => {
    console.log(typeof Gender)
    Gender.get('M')

    console.log(Gender.getLabel(Gender.FEMALE.key))
  }, [])

  return <div>Admin</div>
}

export default Admin
