'use client'
import { AlignRight, Scissors } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Navbar = ({panel}:{panel:'user'|'barber'}) => {
  const { data, status } = useSession();
  const role = data?.user.role?.toLowerCase()
  return (
    <div className=' flex justify-between shadow  h-[60px] items-center p-5 max-md:p-3   '>
      {  <Link href={`/${role?`${role}`:'/'}`} className='text-2xl center gap-2 max-md:text-lg whitespace-nowrap textbase font-bold'>
       <div className="w-9 h-9 max-md:w-8 max-md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Scissors className="w-6 h-6 text-white" />
          </div>
      Quick Hair</Link>  }
      {
        status !== 'loading' && data ? <div className='center gap-2 max-md:gap-1'>
          <div className='max-md:w-[80px] max-md:h-full text-base max-md:text-[10px]'>Welcome , 👋🏻 {data.user.name}</div>
          <img src={data.user.image!} alt="User Avatar" width={40} height={40} className=' max-md:w-8  rounded-full' />
          {panel === 'user' &&   <button onClick={() => signOut()} className=" bg-gradient-to-br from-red-200/50 to-red-500/80 text-red-600 rounded-full border border-red-500  px-5 py-2 max-md:px-3 max-md:text-sm max-md:py-1.5">Logout</button>}
          {panel === 'barber' && <div className='relative group '>
            <label className=' cursor-pointer' htmlFor='is'>
              <AlignRight className='' size={22} />
            </label>
            <input type="checkbox" hidden id="is" />
            <div className='group-has-checked:flex hidden appear absolute  py-3.5 w- z-30 flex-col gap-2  text-white p-2  rounded-3xl bg-[#00056237] !backdrop-blur-[25px] -left-[155px] '>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/barber`}> Home </Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/barber/queue`}> Queue </Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/barber/profile`}>Profile</Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] px-[40px] center' href={`/barber/track`}> Transcation </Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/barber/history`}> History </Link>
              <Link className='text-sm hover:bg-[#5d5fef] bg-[#0f28845f] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] whitespace-nowrap center text-center px-2 ' href={`/barber/canalytics`}>Customer Analytics</Link>
            </div>
          </div>}
        </div> :
          status !== 'loading' && <Link href="/sign-in" className="buttonbg p-2 px-6  hover:underline">
            Sign In
          </Link>
      } 
    </div>
  )
}

export default Navbar