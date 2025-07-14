'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  const { data} = useSession();
  return (
    <div className=' flex justify-between bordercolor !border-b h-[60px] items-center p-5  '>
     {data ? <Link href={`/${data?.user.role?.toLowerCase()}`} className='text-2xl textbase font-bold'>Quick Hair</Link>:
     <Link href={`/`} className='text-2xl textbase font-bold'>Quick Hair</Link>}

     {
      data && <div className='center gap-2'>
        <div>Wellcome , 👋🏻 {data.user.name}</div>
          <img
          src={data.user.image!}
          alt="User Avatar"
          width={40}
          height={40}
          className='rounded-full'
        />
       {/* <button onClick={() => signOut()} className=" buttonred rounded-full text-white px-5 py-2">Logout</button> */}
      </div>
     }
    </div>
  )
}

export default Navbar