'use client'
import { CircleEllipsis } from 'lucide-react'
import {   useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  const { data } = useSession();
  return (
    <div className=' flex justify-between shadow  h-[60px] items-center p-5  '>
      {data ? <Link href={`/${data?.user.role?.toLowerCase()}`} className='text-2xl max-md:text-xl textbase font-bold'>Quick Hair</Link> :
        <Link href={`/`} className='text-2xl textbase font-bold'>Quick Hair</Link>}
      {
        data && <div className='center gap-2'>
          <div>Wellcome , 👋🏻 {data.user.name}</div>
          <img src={data.user.image!} alt="User Avatar" width={40} height={40} className='rounded-full' />
          <div className='relative group '>
            <label className=' cursor-pointer' htmlFor='is'>
              <CircleEllipsis className='' size={22} />
            </label>
            <input type="checkbox" hidden id="is" />
            <div className='group-has-checked:flex hidden appear absolute  py-3.5 w- z-30 flex-col gap-2  text-white p-2  rounded-3xl bg-[#00056237] !backdrop-blur-[25px] -left-[155px] '>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/barber`}> Home </Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/barber/queue`}> Queue </Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/barber/profile`}>Profile</Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] px-[40px] center' href={`/barber/track`}> Transcation </Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/barber/history`}> History </Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] whitespace-nowrap center text-center px-2 ' href={`/canalytics`}>Customer Analytics</Link>
            </div>
          </div>
        </div>
      } 
    </div>
  )
}

export default Navbar