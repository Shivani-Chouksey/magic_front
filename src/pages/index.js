import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from 'react-bootstrap'

function index() {
  const router=useRouter()
  return (
    <div className='p-4'>
      <Button className='mx-2' onClick={()=>router.push("/doctor/signup")}>Signup/Signin As a Doctor</Button>
      <Button  onClick={()=>router.push("/patient/signup")}>Signup/Signin As a Patient</Button>
    </div>
  )
}

export default index
