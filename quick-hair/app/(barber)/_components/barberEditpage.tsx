
'use client'
import { updateBarber } from '@/actions/barber.action'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader, MapPinCheck } from 'lucide-react';
import { BarberProfileProps } from '@/lib/constant'
import moment from 'moment'

const BarberProfileEditPage = ({ data }: { data: BarberProfileProps }) => {
    const [lat, setLat] = useState<number | null>(data?.lat || null)
    const [long, setLong] = useState<number | null>(data?.long || null)
    const [error, setError] = useState<string | null>(null)
    const client = useQueryClient();

const requestLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
                toast.success("Location fetched successfully.");
                localStorage.setItem('BarberTime', new Date().toISOString());
            },
            (error) => {
                switch (error.code) {
                    case 1:
                        toast.error("Location access denied by the user.");
                        setError("Location access denied by the user.");
                        break;
                    case 2:
                        toast.error("Location unavailable. Please check your device settings.");
                        setError("Location unavailable. Please check your device settings. Or come out of the building.");
                        break;
                    case 3:
                        toast.error("Location request timed out.");
                        setError("Location request timed out. Please try again.");
                        break;
                    default:
                        toast.error("An unknown error occurred while fetching location.");
                        setError("An unknown error occurred while fetching location.");
                        break;
                }
            }
        );
    } else {
        toast.error("Geolocation is not supported by this browser.");
    } 
};

    const handleSubmit = async (formdata: FormData) => {
        const name = formdata.get('name') as string;
        const shopName = formdata.get('shopName') as string;
        const phoneNumber = formdata.get('phoneNumber') as string;

        if (!lat && !long) {
            toast.error("Please fetch your current location first.");
            return;
        }
        if (!name || !shopName) {
            toast.error("All fields are required and must be valid.");
            return;
        }

        if (!/^\d+$/.test(phoneNumber) || !/^[6-9]\d{9}$/.test(phoneNumber) || phoneNumber.length < 10) {
            toast.error("Phone number must be a valid number with at least 10 digits.");
            return;
        }
        updateProfile.mutate(formdata);
    }

    const updateProfile = useMutation({
        mutationFn: async (formdata: FormData) => {
            return await updateBarber(formdata, lat, long);
        },
        onSuccess: (data) => {
            if (data.status === 200) {
                toast.success('Profile updated successfully');
                client.invalidateQueries({ queryKey: ['barberprofile'] });
                return;
            }
            else {
                toast.error(data.message);
                return;
            }
        }
    })
    return (
        <div className=' w-full pb-10'>
            <form className=' w-[70%] mt-10 max-md:text-[14px] text-base max-md:w-[90%] mx-auto flex flex-col ' action={handleSubmit}>
                <div className=' flex flex-col gap-2'>
                    <label htmlFor="name">Name</label>
                    <input defaultValue={data?.name} type="text" name="name" id="name" required />
                </div>
                <div className=' flex flex-col gap-2'>
                    <label htmlFor="shopName">Shop Name</label>
                    <input defaultValue={data?.shopName} type="text" name="shopName" id="shopName" required />
                </div>
                <div className=' flex flex-col gap-2'>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input defaultValue={data?.phoneNumber} type="number" name="phoneNumber" id="shopName" required />
                </div>
                <div className={` ${lat ? "  bg-green-400/30" : " card"} my-3 py-5 border rounded-3xl border-dashed `}>
                    {!lat && !long && <button className='w-fit disabled:opacity-10 flex mx-auto buttonbg p-4 ' type="button" onClick={requestLocation}>
                        Get Current Location
                    </button>}
                    {error && <p className='text-red-500 text-sm  text-bold text-center '>{error}</p>}
                    {lat && long && <div className='text-center text-green-600 flex-col center gap-3'>
                        <p className='center gap-1'> Location fetched successfully.<MapPinCheck /> </p>
                        <p className='center text-sm gap-1'> Last updated on {moment(localStorage.getItem('BarberTime')).format('MMMM Do YYYY, h:mm a')} </p>
                        <button className='buttonbg' onClick={() => requestLocation()}>Update Location</button>
                    </div>
                    }
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="location">Landmark / Location</label>
                    <input defaultValue={data?.location} type="text" name="location" id="location" required />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="location">Google Map Link</label>
                    <input defaultValue={data?.gmapLink} type="text" name="link" id="location" required />
                </div>
                <button className='mt-3 center buttonbg p-4 ' type="submit">{updateProfile.isPending ? <Loader className=' animate-spin' /> : 'Update Profile'}</button>
            </form>

        </div>
    )
}
export default BarberProfileEditPage;