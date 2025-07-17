'use client'
import Loading from '@/components/ui/loading'
import { useSocket } from '@/hook/useSocket'
import axios from 'axios'
import { Loader, MapPin, Navigation, Phone, Scissors } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getNearByShops } from '@/actions/user.action'
import { AnimateText } from '@/components/ui/AnimateText'

const UserQueue = ({ lat, long }: { lat: number, long: number }) => {
    const { data: session } = useSession()
    const userId = session?.user.id as string
    const [data, setData] = useState<any[]>([])
    const [isLoading, setLoading] = useState(false)
    const { ready, socket, onlineUser } = useSocket(userId)
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [loadingBarberId, setLoadingBarberId] = useState<string | null>(null);

    useEffect(() => {
        const getNearByShopsByApi = async (lat: number, long: number) => {
            setLoading(true)
            try {
                const response = await getNearByShops(lat, long);
                setData(response);
            } catch (error) {
            }
            setLoading(false)
        }
        getNearByShopsByApi(lat, long)
    }, [lat, long]);

    const joinQueue = async (barberId: string) => {
        if (!barberId || !userId) {
            toast.error("Missing barberId or userId");
            return;
        }
        setLoadingBarberId(barberId);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/join`, {
                barberId,
                userId,
            });
            if (response.status === 200 && response.data.status === 200) {
                toast.success(response.data.message || 'Joined queue successfully!');
            } else {
                toast.error(response.data.message || 'Unexpected response');
            }
        } catch (error: any) {
            toast.error('Failed to join queue, please try again later.');
        } finally {
            setLoadingBarberId(null);
        }
    };

    useEffect(() => {
    if (!ready || !socket) return;

    const onQueueUpdate = (msg: { barberId: string, userId: string, queueId: string }) => {
        setData((prevData) => {
            return prevData.map((shop) => {
                if (shop.id === msg.barberId) {
                    //   const alreadyInQueue = shop.Queue.some((q) => q.userId === msg.userId);
                    //   if (alreadyInQueue) return shop;
                    return {
                        ...shop,
                        Queue: [
                            ...shop.Queue,
                            {
                                id: msg.queueId,
                                userId: msg.userId,
                            },
                        ],
                    };
                }
                return shop;
            });
        });
    }
    const onMessageDeleted = (data: { barberId: string, userId: string, queueId: string }) => {
        setData((prevData) => {
            return prevData.map((shop) => {
                if (shop.id === data.barberId) {
                    return {
                        ...shop,
                        Queue: shop.Queue.filter((q: { userId: string, id: string }) => q.userId !== data.userId || q.id !== data.queueId),
                    };
                }
                return shop;
            });
        });
    };
    socket.on("queueUpdate", onQueueUpdate);
    socket.on('message_deleted', onMessageDeleted);

    return () => {
        socket.off("queueUpdate", onQueueUpdate)
        socket.off('message_deleted', onMessageDeleted)
    };
    }, [socket, ready]);

    return (
    <>
    <div className='  flex items-center justify-between  '>
        <h1 className=' text-xl max-md:text-sm font-medium'>{!lat && !long ? 'Get you Location to find the nearest shop' : ` Found ${data.length} Shops nearby you `}</h1>
        <h2 className=" !items-center bg-gradient-to-b from-green-300/20 to-green-300 p-2 ml-auto my-4 max-md:my-2 font-medium rounded-4xl px-3 cursor-default border w-fit border-green-600 text-green-600 flex gap-1">
            <span className=' animate-ping mr-1 duration-500 delay-300'>🟢</span>
            Online <AnimateText className=' tex-xl'>{onlineUser.length}</AnimateText>
        </h2>
    </div>

    <div className='mt-10 flex flex-wrap  gap-3'>
        {
            data && !isLoading ? data.map((shop, index) => {
                const userQueueIndex = shop.Queue.findIndex(
                    (item: { userId: string }) => item.userId === session?.user.id
                );
                return (
                    <div key={index} className='p-3 max-md:text-sm flex flex-col gap-2 max-md:gap-1 justify-between card bordercolor rounded-3xl max-md:w-[48%] max-md:h-[250px] w-[360px] h-[220px]'>
                        <h2 className='flex items-center gap-1'><Scissors className=' max-md:h-5 ' /> {shop.shopName}</h2>
                        <h2 className='flex items-center gap-1'> <MapPin className='max-md:h-5  ' /> {shop.location}</h2>
                        <p className='flex items-center gap-1'><Phone className=' max-md:h-5 ' /> <a href={`tel:+91${shop.phoneNumber}"`}> {shop.phoneNumber}</a></p>
                        <p className=' flex items-center'>Queue Count : <span className=' items-center flex font-semibold text-lg text-[#db2777] '>
                            <AnimateText className=' tex-2xl'>{shop.Queue.length}</AnimateText>
                        </span>
                        </p>

                        <p>Distance : {shop?.distanceText} approx</p>
                        <div className='text-sm max-md:flex-col center  !items-start gap-2'>

                            {
                                userQueueIndex !== -1 ? (
                                    <p className='bg-green-400/40 whitespace-nowrap p-2 rounded-4xl center px-3 cursor-default border max-md:w-full  border-green-500 text-green-600'>
                                        {userQueueIndex + 1 === 1 ? "Now Your Turn" : `You are in # ${userQueueIndex + 1}`}
                                    </p>
                                ) : (
                                    <button onClick={() => joinQueue(shop.id)} className='buttonbg center whitespace-normal max-md:w-full !px-2'>
                                        {loadingBarberId ? <Loader className='animate-spin' /> :" Join Queue"}
                                    </button>
                                )
                            }
                            {/* <button disabled={loadingBarberId == shop.id} onClick={() => joinQueue(shop.id)} className='buttonbg center whitespace-normal max-md:w-full !px-2'>
                                {loadingBarberId == shop.id ? <Loader className='animate-spin' /> : " Join Queue"}
                            </button> */}
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

{/* {
userQueueIndex !== -1 ? (
    <p className='bg-green-400/40 whitespace-nowrap p-2 rounded-4xl center px-3 cursor-default border max-md:w-full  border-green-500 text-green-600'>
        You are in #{userQueueIndex + 1}
    </p>
) : (
    <button onClick={() => joinQueue(shop.id)} className='buttonbg center whitespace-normal max-md:w-full !px-2'>
        {loadingBarberId ? <Loader className='animate-spin' /> :" Join Queue"}
    </button>
)
} */}