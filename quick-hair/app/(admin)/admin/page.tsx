'use client'
import { createBarber } from '@/actions/admin.action';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react'
import toast, { LoaderIcon } from 'react-hot-toast';

const AdminPage = () => {
    const { update } = useSession();
    const handleSubmit = async(fromData: FormData) => {
        const email = fromData.get('email') as string;
        const role = fromData.get('role') as string;
        if (!email) {
            toast.error("Id is required");
            return;
        }  
        if (role !== "BARBER") {
            await update({ role: "USER" });
            toast.success("Created user successfully");
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
                await update({ role: "BARBER" });
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        }

    })
    return (
        <div className=' w-full h-screen flex items-center justify-center'>
            <form className='w-1/2 card h-1/2 rounded-4xl flex flex-col items-center justify-center ' action={handleSubmit}>
                <h1 className='text-2xl font-bold mb-4'>Admin Page</h1>
                <input name='email' type="email" placeholder="Email." className=" w-[350px]  p-2 mb-4" />
                <select name="role" >
                    <option value="BARBER">Barber</option>
                    <option value="USER">User</option>
                </select>
                <button type="submit" className="buttonbg  text-white px-4 py-2 rounded-full">
                    {MadeBarber.isPending ? <LoaderIcon /> : "Create Barber"}
                </button>
            </form>
        </div>
    )
}

export default AdminPage

// cmczt7w7k0000t07e1ds5guxi