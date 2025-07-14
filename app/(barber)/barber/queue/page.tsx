'use client'
import { completeQueueItem, deleteQueueItem, getBarberQueue } from '@/actions/barber.action'
import Loading from '@/components/ui/loading'
import SwipeRevealActions from '@/components/ui/swipeToDelete'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const BarberQueuePage = () => {
  const quary = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['barberQueue'],
    queryFn: async () => {
      const response = await getBarberQueue()
      return response
    },
  }) 
  const [showEdit, setShowEdit] = useState({queueId:'',userId:'',barberId:''});
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
        mutationFn: async (id:string) => {
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
        mutationFn: async ({ queueId, userId,barberId, formData }: { queueId: string; userId: string; barberId:string;formData: FormData }) => {
            return await completeQueueItem(queueId, userId, barberId ,formData);
        },
        onSuccess: (data) => {
            if (data.status !== 200) {
                toast.error(data.message);
                return;
            }
            else {
                toast.success(data.message);
                setShowEdit({queueId:'',userId:'',barberId:''});
                quary.invalidateQueries({ queryKey: ['barberQueue'] })
            }
        }
    })

  const handleDelete = async(id: string) => {
    deleteQueueMutation.mutate(id)
  };

  const handleUpdate = (queueId:string , userId :string,barberId:string) => {
    console.log(`Queue ID: ${queueId}, User ID: ${userId} , Barber ID: ${barberId}`);
    setShowEdit({ queueId: queueId, userId: userId  , barberId: barberId });
    setOpenItemId(null);  
  };

  const handleOpen = (id: string) => {
    setOpenItemId(id);
  };

  const handelDone=(formData:FormData)=>{ 
    const userId = showEdit.userId || '';
    const queueId = showEdit.queueId || '';
    const barberId = showEdit.barberId || '';
    CompleteQueueMutation.mutate({ queueId, userId,barberId , formData })
  }
  return (
    <div className='relative w-full'>
      <h1 className=' text-center text-xl font-semibold my-5'>Mange Queue {data?.data?.length}</h1>

     { showEdit.userId && <div className=' fixed h-full w-full top-0 left-0 backdrop-blur-[20px]  bg-[#00000046] p-4 z-100'>
        <button onClick={() => setShowEdit({userId:'',queueId:'' ,barberId:''})} className=' px-4 py-2 '>
          <X color='white'/>
        </button>
          <form className="flex card mt-20 rounded-3xl w-1/2 min-h-[100px] max-md:w-[90%]  flex-col gap-6 p-6   mx-auto   shadow-md" action={handelDone}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  <input type="checkbox" value="haircut" name="service" id="haircut" className="accent-blue-500" />
                  <label htmlFor="haircut" className="text-gray-700 text-sm">Haircut</label>
                </div>

                <div className="flex items-center gap-1">
                  <input type="checkbox" value="facial" name="service" id="facial" className="accent-blue-500" />
                  <label htmlFor="facial" className="text-gray-700 text-sm">Facial</label>
                </div>

                <div className="flex items-center gap-1">
                  <input type="checkbox" value="spa" name="service" id="spa" className="accent-blue-500" />
                  <label htmlFor="spa" className="text-gray-700 text-sm">Spa</label>
                </div>

                <div className="flex items-center gap-1">
                  <input type="checkbox" value="beard" name="service" id="beard" className="accent-blue-500" />
                  <label htmlFor="beard" className="text-gray-700 text-sm">Beard</label>
                </div>

                <div>
                  <label htmlFor="amount" className="block mb-1 text-gray-700 text-sm">Total Amount</label>
                  <input name="amount" type="number" className="w-full px-4 py-2 bordercolor rounded-md " 
                  />
                </div>
              </div>

              <button type="submit" className="mt-4 buttonbg">{'Submit'}</button>
            </form>
      </div>}

      <div className='min-h-[40vh] mx-auto w-[70%] max-md:w-[95%]'>
        {
          isLoading ? (
            <Loading boxes={5} child='w-full h-[80px] !rounded-xl !flex-row' parent='mx-auto w-[70%] max-md:w-[95%]' />
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
                  {/* <p><strong>Customer Id:</strong> {item?.Queue.id}</p> */}
                  <p className=' mt-2'><strong>Date / Time:</strong> {moment(item.enterdAt).format('MMMM Do YYYY, h:mm a')}</p>
                </div >
              </SwipeRevealActions>
            ))
          ) : (
            <p className='text-center font-me mt-10 text-lg'>No customers in the queue.</p>
          )
        }
      </div>


    </div>
  )
}

export default BarberQueuePage