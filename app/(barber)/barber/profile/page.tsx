
'use client'
import { getBarber } from '@/actions/barber.action'
import {   useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import Loading from '@/components/ui/loading'
import BarberProfileEditPage from '../../_components/barberEditpage'

const BarberProfilePage = () => {
    const [showEditPage, setShowEditPage] = useState('profile');
    const {data , isLoading} = useQuery({
        queryKey: ['barber'],
        queryFn: async () => {
            const response = await getBarber();
            return response 
        },      
    })
    console.log("Barber Data:", data);
    if (isLoading) {
        return <div className='h-screen w-full '>
            <Loading boxes={1} child=" w-[70%] max-md:w-[90%] mt-30 h-[490px]  " parent="h-screen" />
        </div>
    }
    return (
        <div> 
            <div className='flex  border  w-fit mx-auto rounded-full justify-center mt-10'>
                <button className={`px-5 py-2 rounded-full ${showEditPage === 'profile' ? " buttonbg " :" "}`} onClick={() => setShowEditPage('profile')}>
                  Profile
                </button>
                <button className={`px-5 py-2 rounded-full ${showEditPage === 'edit' ? " buttonbg " :" "}`} onClick={() => setShowEditPage('edit')}>
                   Edit
                </button>
            </div>
            {showEditPage ==='edit' ? <BarberProfileEditPage data={data} />:
            <div className='card rounded-3xl px-5 py-3 flex flex-col gap-3 mx-auto w-[70%] max-md:w-[90%] mt-10'>
             <h1 className='text-2xl text-center font-bold mt-10'>Profile Page</h1>
             <img className='mx-auto bordercolor w-32 h-32 rounded-full' src={data?.user?.image} alt="" />
            <p>User Id : <span className=' font-semibold text-xl'>{data.userId}</span></p>
            <p>Signed as : <span className=' font-semibold text-xl'>{data?.user?.email}</span></p>
            <p>Name: {data?.name}</p>
            <p>Shop Name : {data?.shopName}</p>
            <p>Location : {data?.location}</p>
            <p>Google Map Link : {data?.location}</p>
            <p>Phone Number : {data?.phoneNumber}</p>
            <p>Latitude: {data?.lat}</p>
            <p>Longitude: {data?.long}</p>

            </div>
            }
        </div>
    )
}

export default BarberProfilePage



 