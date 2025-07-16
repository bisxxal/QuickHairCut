'use client'
import { completeQueueItem, deleteQueueItem, getBarber, getBarberQueue } from '@/actions/barber.action'
import AnimatedDigit from '@/components/ui/animatedDigit'
import CountUp from '@/components/ui/countup'
import Loading from '@/components/ui/loading'
import Pagination from '@/components/ui/pagination'
import SwipeRevealActions from '@/components/ui/swipeToDelete'
import { useSocket } from '@/hook/useSocket'
import { formatDateForIndia, serviceOptions } from '@/lib/util'
import { useMutation } from '@tanstack/react-query'
import { Loader, X } from 'lucide-react'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface BabrberQueueProps {
  barberId: string;
  userId: string;
  id: string;
  enteredAt: Date,
  user: {
    name: string;
    phoneNumber: string;
  }
}
const BarberQueuePage = () => {
  const { data: session } = useSession()
  const userId = session?.user.id as string
  const { socket, ready, onlineUser } = useSocket(userId)
  const [data, setData] = useState<{ data: BabrberQueueProps[]; count: number }>({ data: [], count: 0 });
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false)
  const limit = 3;

  const [barberId, setBarberId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem('bid');
      return val ? (val) : null;
    }
    return null;
  });
  
  useEffect(() => {
    const fetchBarberId = async () => {
      if (!barberId) {
        const response = await getBarber()
        if (response) {
          setBarberId(response.id);
          localStorage.setItem('bid', response.id);
        }
      }
    }
    if(!barberId) {
      fetchBarberId();
    }
  }, [barberId]);

  useEffect(() => {
    const getNearByShopsByApi = async (page: number) => {
      setLoading(true)
      try {
        const response = await getBarberQueue(page);
        setData(response);
      } catch (error) {
      }
      setLoading(false)
    }
    getNearByShopsByApi(page);
  }, [page]);


  useEffect(() => {
    if (!ready || !socket) return;
    const onQueueUpdate = (msg: { barberId: string; userId: string; queueId: string; queue: any }) => {
      if( msg.barberId !== barberId) return;
      setData(prev => ({
        data: [...prev.data, msg.queue],
        count: prev.count + 1
      }));
    };
    socket.on("queueUpdate", onQueueUpdate);
    return () => {
      socket.off("queueUpdate", onQueueUpdate);
    };
  }, [socket, ready]);


  const [showEdit, setShowEdit] = useState({ queueId: '', userId: '', barberId: '' });
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setItemRef = (id: string, ref: HTMLDivElement | null) => {
    itemRefs.current[id] = ref;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!openItemId) return;

      const openRef = itemRefs.current[openItemId];
      if (openRef && !openRef.contains(e.target as Node)) {
        setOpenItemId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openItemId]);


  const deleteQueueMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteQueueItem(id);
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        toast.error(data.message);
        return;
      }
      else {
        if (data.queueItem) {
          socket?.emit('message_deleted', { queueId: data?.queueItem?.id, barberId: data.queueItem.barberId, userId: data.queueItem.userId });
          setData(prev => {
            const updatedData = prev.data.filter(item => item.id !== data?.queueItem?.id);
            return {
              ...prev,
              data: updatedData,
              count: Math.max(prev.count - 1, 0)
            };
          });
        }
        toast.success(data.message);
      }
    }
  })

  const CompleteQueueMutation = useMutation({
    mutationFn: async ({ queueId, userId, barberId, formData }: { queueId: string; userId: string; barberId: string; formData: FormData }) => {
      return await completeQueueItem(queueId, userId, barberId, formData);
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        toast.error(data.message);
        return;
      }
      else {
        if (data.queueItem) {
          socket?.emit('message_deleted', { queueId: data?.queueItem?.id, barberId: data.queueItem.barberId, userId: data.queueItem.userId });
          setData(prev => {
            const updatedData = prev.data.filter(item => item.id !== data?.queueItem?.id);
            return {
              ...prev,
              data: updatedData,
              count: Math.max(prev.count - 1, 0)
            };
          });
        }
        toast.success(data.message);
        setShowEdit({ queueId: '', userId: '', barberId: '' });

      }
    }
  })

  const handleDelete = async (id: string) => {
    deleteQueueMutation.mutate(id)
  };

  const handleUpdate = (queueId: string, userId: string, barberId: string) => {
    setShowEdit({ queueId: queueId, userId: userId, barberId: barberId });
    setOpenItemId(null);
  };

  const handleOpen = (id: string) => {
    setOpenItemId(id);
  };

  const handelDone = (formData: FormData) => {
    const userId = showEdit.userId || '';
    const queueId = showEdit.queueId || '';
    const barberId = showEdit.barberId || '';
    CompleteQueueMutation.mutate({ queueId, userId, barberId, formData })
  }
  const totalPages = Math.ceil(data?.count / limit);

  const [prevCount, setPrevCount] = useState(onlineUser.length);

  useEffect(() => {
    setPrevCount(onlineUser.length);
  }, [onlineUser.length]);

  const currDigits = String(onlineUser.length).split('');
  const prevDigits = String(prevCount).padStart(currDigits.length, '0').split('');

  return (
    <div className='relative w-full px-4 pb-10'>

      <div className=' flex items-center justify-end w-1/2 ml-auto max-md:w-full  max-md:items-start max-md:gap-2'>
        <h1 className=' text-center text-xl font-semibold my-5'>Mange Queue <span className=' textbase'>
          {data?.count && <CountUp from={0} to={data?.count} separator="," direction="up" duration={1} className="count-up-text text-xl " />}</span></h1>
        <h2 className=" bg-gradient-to-b from-green-300/20 to-green-300 p-2 ml-auto my-4 font-medium rounded-4xl px-3 cursor-default border w-fit border-green-500 text-green-600 flex gap-1">
          <span className='delay-300 animate-ping mr-1'>🟢</span> Online
          {currDigits.map((digit, idx) => (
            <AnimatedDigit key={idx + '-' + digit} digit={digit} prevDigit={prevDigits[idx] || digit} />))}
        </h2>
      </div>
      {showEdit.userId && <div className='popupOpen fixed h-full w-full top-0 left-0 backdrop-blur-[20px]  bg-[#00000046] p-4 z-100'>
        <button onClick={() => setShowEdit({ userId: '', queueId: '', barberId: '' })} className=' px-4 py-2 '>
          <X color='white' />
        </button>
        <form className="flex card mt-20 rounded-3xl w-[70%] min-h-[100px] max-md:w-[95%]  flex-col gap-6 p-6   mx-auto   shadow-md" action={handelDone}>
          <div className="flex flex-co flex-wrap gap-5">
            {
              serviceOptions.map((service) => (
                <div key={service} className="flex bg-[#6e56cfcc] text-white rounded-lg py-1 px-2 items-center gap-1" >
                  <input type="checkbox" value={service} name="service" id={service} className="accent-pink-500" />
                  <label htmlFor={service} className=" text-[14px] capitalize">{service.replace(/([A-Z])/g, ' $1')}</label>
                </div>
              ))
            }
          </div>
          <div>
            <label htmlFor="amount" className="block mb-1 text-gray-700 text-sm">Total Amount</label>
            <input name="amount" type="number" className="w-full px-4 py-2 bordercolor rounded-md "
            />
          </div>

          <button disabled={CompleteQueueMutation.isPending} type="submit" className="center mt-4 buttonbg">{CompleteQueueMutation.isPending ? <Loader className='animate-spin' /> : 'Submit'}</button>
        </form>
      </div>}

      <div className='min-h-[40vh] mx-auto w-[70%] max-md:w-[95%]'>
        {
          isLoading ? (
            <Loading boxes={5} child='w-full h-[135px] max-md:h-[130px] !rounded-xl !flex-row' parent='mx-auto w-[70%] max-md:w-full ' />
          ) : data && data?.data?.length > 0 ? (
            data?.data?.map((item: any) => (
              <SwipeRevealActions
                key={item.id}
                id={item.id}
                barberId={item.barberId}
                userId={item.userId}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                isOpen={openItemId === item.id}
                onOpen={handleOpen}
                setRef={setItemRef}
                border={'rounded-xl'}
              >
                <div className='p-4 w-full card bordercolor rounded-xl cursor-pointer'>
                  <p><strong>Customer Name:</strong> {item?.user.name}</p>
                  <p><strong>Customer Id:</strong> {item?.userId}</p>
                  <p><strong>Phone No:</strong> {item?.user.phoneNumber}</p>
                  <p className=' mt-2'><strong>Date / Time:</strong> {formatDateForIndia(item.enteredAt)}</p>
                </div >
              </SwipeRevealActions>
            ))
          ) : (
            <p className='text-center font-me mt-10 text-lg'>No customers in the queue.</p>
          )
        }
      </div>

      {data?.count && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
    </div>
  )
}

export default BarberQueuePage