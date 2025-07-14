import Link from 'next/link'
import React from 'react'
import BarberQueuePage from './queue/page'

const BarberMainPage = () => {
  return (
    <div className='pb-10 center gap-3 flex-col'>
      <h2 className=' mt-10 text-lg font-medium'>Quick Links</h2>
      <div className=' center flex-wrap gap-3'>
        <Link className='flex w-[200px] center buttonbg' href="/barber/profile">Go to Profile</Link>
        <Link className='flex w-[200px] center buttonbg' href="/barber/queue">View Queue</Link>
        <Link className='flex w-[200px] center buttonbg' href="/barber/history">Service History</Link>
        <Link className='flex w-[200px] center buttonbg' href="/barber/track">Track Transactions</Link>
      </div>
      <BarberQueuePage />
    </div>
  )
}

export default BarberMainPage