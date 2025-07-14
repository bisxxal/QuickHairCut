'use client'
import { getBarberTrack } from '@/actions/barber.action'
import Loading from '@/components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const TrackPage = () => {
    // const quary = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['barberQueue'],
    queryFn: async () => {
      const response = await getBarberTrack()
      return response
    },
  }) 
  console.log(data?.data)
  return (
    <div>TrackPage
        {isLoading && <div className='flex justify-center items-center h-screen'><Loading boxes={5} child='' parent='' /></div>}
        {data?.data?.length === 0 && <h1 className='text-center text-2xl font-semibold'>No Track Found</h1>}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
            {data?.data?.map((item: any) => (
            <div key={item.id} className='card p-4 shadow-md rounded-lg'>
                <h2 className='text-lg font-semibold'>{item.name}</h2>
                <p>{item.completedAt}</p>
                <p>{item.amount}</p>
                <p>{item.user.name}</p>
                <p>services: {item.service.map((i)=> <span className=' accent py-1  rounded -xl mr-2 p-2'>{i} {"  "}</span> )}</p>
            </div>
            ))}
        </div>
    </div>
  )
}

export default TrackPage