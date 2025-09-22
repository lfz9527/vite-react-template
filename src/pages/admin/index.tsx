import { Gender } from '@/enum'
import { useEffect } from 'react'

const Admin = () => {
  useEffect(() => {
    Gender.toArray().forEach((g) => {
      console.log(g.key)
    })
    // Gender.get(Gender.FEMALE)
  }, [])

  return <div>Admin</div>
}

export default Admin
