'use client'
import { getBarberTransactions } from '@/actions/barber.action'
import Back from '@/components/ui/back'
import Loading from '@/components/ui/loading'
import { CartesianGrid, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, Bar, } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { endOfMonth, startOfMonth } from 'date-fns';
import DateButton from '@/components/dateButtons'
import { COLORS2 } from '@/lib/util'
const TrackPage = () => {
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
    if (!data?.data) return;
    const groupedMap = new Map<string, { amount: number, timestamp: number }>();

    data.data.forEach((curr: { amount: number, completedAt: string }) => {
      if (curr.amount === null || !curr.completedAt) return;
      const normalizedDate = moment(curr.completedAt).format('YYYY-MM-DD');
      const timestamp = new Date(normalizedDate).getTime();

      if (groupedMap.has(normalizedDate)) {
        const existing = groupedMap.get(normalizedDate)!;
        existing.amount += curr.amount;
      } else {
        groupedMap.set(normalizedDate, {
          amount: curr.amount,
          timestamp,
        });
      }
    });

    const sorted = Array.from(groupedMap.entries())
      .map(([dateKey, value]) => ({
        amount: value.amount,
        date: moment(dateKey).format('Do MMMM YYYY'),
        timestamp: value.timestamp,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    setTypeData(sorted);
  }, [data, startDate, endDate]);
 
  return (
    <div className=' w-full min-h-screen pb-20'>
      <Back className='' />
      <h1 className=' text-center text-xl  font-semibold '>Date vs Income</h1>
      <DateButton startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      {isLoading && <>
        <Loading boxes={1} child='  mx-auto h-[400px] max-md:w-[95%] w-[70%] !rounded-3xl ' parent=' !p-4 flex !flex-row !items-start !justify-start flex-wrap' />
        <Loading boxes={1} child='  mx-auto h-[500px] w-[95%] !rounded-3xl ' parent=' !p-4 flex !flex-row !items-start !justify-start flex-wrap' />
      </>}
      {data?.data.length !== 0 && !isLoading ? <>
        <div className='flex flex-col mt-10 max-md:w-[95%] w-[70%] card mx-auto border border-[#6e56cf]   rounded-3xl items-center justify-center'>
          <PieChart width={400} height={400}>
            <Pie
              data={typedata}
              dataKey="amount"
              nameKey="date"
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

        </div>

        <div className=' w-[95%] mx-auto mt-9 h-[400px] border bordercolor rounded-3xl mb-4 card p-2 px-4'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={730} height={250} data={typedata}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis className=' text-xs' dataKey="date" />
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
  )
}

export default TrackPage