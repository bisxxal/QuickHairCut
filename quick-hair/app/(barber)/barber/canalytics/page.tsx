'use client'
import { getBarberTransactions } from '@/actions/barber.action'
import Back from '@/components/ui/back'
import Loading from '@/components/ui/loading'
import { CartesianGrid, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, Bar, } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { endOfMonth, startOfMonth } from 'date-fns';
import DateButton from '@/components/dateButtons'
import { COLORS2 } from '@/lib/util'

const CustomerAnalyticsPage = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(startOfMonth(today));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(today));
  const [typedata, setTypeData] = useState([])
  const { data, isLoading } = useQuery({
    queryKey: ['barberTrack', startDate, endDate],
    queryFn: async () => {
      const response = await getBarberTransactions(startDate, endDate)
      return response
    },
  })

  useEffect(() => {
    const users = data?.data.reduce((acc:{name:string,amount:number,count:number}[], curr:{user:{name:string},amount:number}) => {
      const existing = acc.find(user => user.name === curr.user.name);
      if (existing) {
        existing.amount += curr.amount;
        existing.count += 1;
        // return acc;
      }
      else {
        acc.push({ name: curr.user.name, amount: curr.amount, count: 1 })
      }
      return acc
    }, [])

    setTypeData(users || []);
  }, [data])
  return (
    <div>
      <div className=' w-full min-h-screen pb-20'>
        <Back className='' />
        <h1 className=' text-center text-xl  font-semibold '>Customer vs Income</h1>
        <DateButton startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
        {isLoading && <>
          <Loading boxes={1} child='  mx-auto h-[400px] max-md:w-[95%] w-[70%] !rounded-3xl ' parent=' !p-4 flex !flex-row !items-start !justify-start flex-wrap' />
          <Loading boxes={1} child='  mx-auto h-[500px] w-[95%] !rounded-3xl ' parent=' !p-4 flex !flex-row !items-start !justify-start flex-wrap' />
        </>}
        {data?.data.length !== 0 && !isLoading ? <>
          <div className='flex max-md:flex-col  mt-10 max-md:w-[95%] w-[70%] card mx-auto border border-[#6e56cf]   rounded-3xl items-center justify-around px-5'>
            <PieChart width={400} height={400}>
              <Pie
                data={typedata}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={(entry) => `₹${(entry).amount}`}
              >
                {typedata?.map((_, index) => (
                  <Cell className=' text-sm' key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                ))}

              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff20',
                  color: 'white',
                  borderRadius: '5px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid transparent',
                }}
                itemStyle={{
                  color: 'white',
                  fontWeight: 'bold',
                }} />
            </PieChart>

            <div className=' flex flex-col gap-2 '>
              {
                typedata.map((item:{name:string ,amount:number,count:number}, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full' style={{ backgroundColor: COLORS2[index % COLORS2.length] }}></div>
                    <span className='text-sm'>{item.name} <span className=' text-lg font-semibold'>₹{item.amount}</span>  Total visit:{item.count}</span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className=' w-[95%] mx-auto mt-9 h-[400px] border bordercolor rounded-3xl mb-4 card p-2 px-4'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={730} height={250} data={typedata}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis className=' text-xs' dataKey="name" />
                <YAxis />
                <Tooltip

                  contentStyle={{
                    backgroundColor: '#ffffff20',
                    color: 'white',
                    borderRadius: '5px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid transparent',
                  }}
                  itemStyle={{
                    color: 'white',
                    fontWeight: 'bold',
                  }} />
                <Bar className='card rounded-3xl' radius={3} dataKey="amount" fill="#5C5FEF" />
              </BarChart>
            </ResponsiveContainer >
          </div>
        </>
          : !isLoading && <p className='center text-xl font-semibold'>No History Found</p>}
      </div>
    </div>
  )
}

export default CustomerAnalyticsPage