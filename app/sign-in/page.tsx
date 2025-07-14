'use client'
 
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const SignInPage = () => {
  const router = useRouter()
  async function myFunction() {
    const session = await getSession()
    if (session?.user?.role) {
      router.push( `/${session.user.role.toLowerCase()}`);
    }
  }
  useEffect(() => {
    myFunction()
  }, [])
  return (
    <div className=' w-full  h-screen overflow-hidden'>

      <div className='w-full h-full center flex-col '>
          
          <h1 className='text-xl text-gray-600 mt-10 appear'>Live && Enjoy && Date.</h1>
        <div className=" cursor-pointer flex justify-center items-center h-screen w-full">

      <button className="cursor-pointer shadow-xl center gap-3 text-xl px-8 py-3 rounded-full buttonbg2 " onClick={() => signIn('google')}> sign in with google </button>
    </div>
      </div>
    </div>
  )
}

export default SignInPage