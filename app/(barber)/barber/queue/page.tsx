'use client'
import { completeQueueItem, deleteQueueItem, getBarberQueue } from '@/actions/barber.action'
import Loading from '@/components/ui/loading'
import Pagination from '@/components/ui/pagination'
import SwipeRevealActions from '@/components/ui/swipeToDelete'
import { serviceOptions } from '@/lib/util'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, X } from 'lucide-react'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const BarberQueuePage = () => {
   const [page, setPage] = useState(1);
    const limit = 3;
  const quary = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['barberQueue' , page],
    queryFn: async () => {
      const response = await getBarberQueue(page)
      return response
    },
  })
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
        toast.success(data.message);
        quary.invalidateQueries({ queryKey: ['barberQueue'] })
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
        toast.success(data.message);
        setShowEdit({ queueId: '', userId: '', barberId: '' });
        quary.invalidateQueries({ queryKey: ['barberQueue'] })
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
  return (
    <div className='relative w-full pb-10'>
      <h1 className=' text-center text-xl font-semibold my-5'>Mange Queue {data?.count}</h1>
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
          ) : data && data.data.length > 0 ? (
            data.data.map((item: any) => (
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
                  <p className=' mt-2'><strong>Date / Time:</strong> {moment(item.enterdAt).format('MMMM Do YYYY, h:mm a')}</p>
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