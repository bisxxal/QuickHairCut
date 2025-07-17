'use client'
import { createBarber } from '@/actions/admin.action';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import toast, { LoaderIcon } from 'react-hot-toast';

const AdminPage = () => {
    const handleSubmit = async (fromData: FormData) => {
        const email = fromData.get('email') as string;
        const role = fromData.get('role') as string;
        if (!email) {
            toast.error("Email is required");
            return;
        }
        MadeBarber.mutate(fromData);
    }
    const MadeBarber = useMutation({
        mutationFn: async (fromData: FormData) => {
            return await createBarber(fromData);
        },
        onSuccess: async (data) => {
            if (data.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        }

    })

    return (
        <div className=' w-full h-screen flex items-center justify-center'>
            <form className='w-1/2 max-md:w-[90%] card h-1/2 rounded-4xl flex flex-col gap-3 items-center justify-center ' action={handleSubmit}>
                <h1 className='text-2xl font-bold mb-4'>Change Role</h1>
                <input required name='email' type="email" placeholder="bishal@quickhaircut.com" className=" w-1/2 max-md:w-[90%] p-2 mb-4" />
                <select className=' w-1/2 max-md:w-[90%]' name="role" >
                    <option value="BARBER">Barber</option>
                    <option value="USER">User</option>
                </select>
                <button type="submit" className="buttonbg max-md:w-[90%]  text-white px-4 py-2 w-1/2 rounded-full">
                    {MadeBarber.isPending ? <LoaderIcon /> : "Apply changes"}
                </button>
            </form>
            
        </div>
    )
}

export default AdminPage

// cmczt7w7k0000t07e1ds5guxi