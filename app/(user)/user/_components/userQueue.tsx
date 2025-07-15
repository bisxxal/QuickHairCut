'use client'
import { getNearByShops, userJoinQueue } from '@/actions/user.action'
import Loading from '@/components/ui/loading'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MapPin, Navigation, Phone, Store } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import toast from 'react-hot-toast'

const UserQueue = ({ lat, long }: { lat: number, long: number }) => {
    const { data: session } = useSession()
    const quary = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ['nearbyShops', lat, long],
        queryFn: async () => {
            const response = await getNearByShops(lat, long)
            return response
        },
    })
    const handelJoinQueue = useMutation({
        mutationFn: async (barberId: string) => {
            const response = await userJoinQueue(barberId)
            return response
        },
        onSuccess: (data) => {
            if (data.status === 200) {
                toast.success(data.message || 'Joined queue successfully!');
                quary.invalidateQueries({ queryKey: ['nearbyShops'] })
            } else {
                toast.error(data.message)
            }
        },
        onError: (error) => {
            toast.error('Failed to join queue, please try again later.')
        }
    })
    return (
        <>
            <h1 className='pt-10 text-xl max-md:text-base font-medium'>{!lat && !long ? 'Get you Location to find the nearest shop' : 'Showing nearby Shops'}</h1>
            <div className='mt-10 flex flex-wrap  gap-3'>
                {
                    data && !isLoading ? data.map((shop, index) => {
                        const userQueueIndex = shop.Queue.findIndex(
                            (item) => item.userId === session?.user.id
                        );
                        return (
                            <div key={index} className='p-3 max-md:text-sm flex flex-col gap-2 max-md:gap-1 justify-between card bordercolor rounded-3xl max-md:w-[48%] max-md:h-[250px] w-[360px] h-[220px]'>
                                <h2 className='flex items-center gap-1'><Store className=' max-md:h-5 ' /> {shop.shopName}</h2>
                                <h2 className='flex items-center gap-1'> <MapPin className='max-md:h-5  ' /> {shop.location}</h2>
                                <p className='flex items-center gap-1'><Phone className=' max-md:h-5 ' /> <a href={`tel:+91${shop.phoneNumber}"`}> {shop.phoneNumber}</a></p>

                                <p>Queue Count : <span className=' text- font-semibold text-lg text-[#ff5470] '>{shop.Queue.length}</span></p>
                                <p>Distance : {shop?.distanceText} approx</p>
                                <div className='text-sm max-md:flex-col center  !items-start gap-2'>
                                    {
                                        userQueueIndex !== -1 ? (
                                            <p className='bg-green-400/40 whitespace-nowrap p-2 rounded-4xl center px-3 cursor-default border max-md:w-full  border-green-500 text-green-600'>
                                                You are in #{userQueueIndex + 1}
                                            </p>
                                        ) : (
                                            <button onClick={() => handelJoinQueue.mutate(shop.id)} className='buttonbg whitespace-normal max-md:w-full !px-2'>
                                                Join Queue
                                            </button>
                                        )
                                    }
                                    <Link href={`${shop.gmapLink}`} className=' border border-[#33335b7e] text-white  bg-[#6e56cfcc] px-2 py-2 whitespace-nowrap rounded-4xl max-md:w-full max-md:text-xs  gap-0.5 center'><Navigation className='max-md:h-4 h-5' />View in Google Map</Link>
                                </div>
                            </div>
                        )
                    })
                        : isLoading ? <Loading boxes={4} parent='w-full !flex-row justify-start max-md:justify-between !flex-wrap max-md:gap-2 gap-3' child=' w-[360px] max-md:w-[48%] max-md:h-[250px] h-[220px] ' /> : <p>No Shops Found</p>
                }
            </div>
        </>
    )
}

export default UserQueue