'use client'
import { MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Back = ({className}:{className:string}) => {
    const router = useRouter()
  return (
    <button onClick={()=>router.back()} className={`${className} backdrop-blur-xl bg-[#0000002f]  w-fit rounded-full mt-4 ml-5 p-2 `}>
        <MoveLeft color='white' />
    </button>
  )
}

export default Back