'use client'
import { getBarberTrack } from '@/actions/barber.action'
import { AnimateText } from '@/components/ui/AnimateText'
import Back from '@/components/ui/back'
import Loading from '@/components/ui/loading'
import Pagination from '@/components/ui/pagination'
import { formatDateForIndia } from '@/lib/util'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

const History = () => {
    const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useQuery({
    queryKey: ['barberTrack', page],
    queryFn: async () => {
      const response = await getBarberTrack(page)
      return response
    },
  }) 
  const totalPages = Math.ceil(data?.count / limit);
  return (
    <div className=' w-full pb-10'>
      <Back className='' />
      <h1 className=' text-center text-xl gap-1  center font-semibold '>Service History {data?.count && <AnimateText className='textbase font-bold'>{data?.count}</AnimateText>} </h1>
      {isLoading && <Loading boxes={8} child='w-[340px] h-[200px] max-md:w-full max-md:w-[200px] !rounded-2xl' parent=' !p-4 flex !flex-row !items-start !justify-start flex-wrap' />}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4'>
        {data?.data.length !== 0 ? data?.data?.map((item: any) => (
          <div key={item.id} className='card  border border-[#6e56cf] p-4 shadow rounded-2xl'>
            <h2 className='text-lg font-semibold'>{item.name}</h2>
            <p>Customer Name : {item.user.name}</p>
            {item.amount && <p className=' text-2xl font-semibold '>₹{item.amount}</p>}
            <p>Date : {formatDateForIndia(item.completedAt)}</p>
            {item?.service && item?.service.length !== 0 &&
              <div className=' flex flex-wrap gap-1 mt-2'>services: {item?.service?.map((i: string) => <span key={i} className=' !text-xs border border-[#33335b7e] text-white  bg-[#6e56cfcc] py-0.5  rounded-lg p-2'>{i} {"  "}</span>)}</div>}
          </div>
        )) : <p className='center text-xl font-semibold'>No History Found</p>}

      </div>
     { data?.count && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
    </div>
  )
}

export default History