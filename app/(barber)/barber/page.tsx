import Link from 'next/link'
import React from 'react'
import BarberQueuePage from './queue/page'

const BarberMainPage = () => {
  return (
    <div className=' center gap-3 flex-col'>
      <p>Welcome to the barber's main page!</p>
      <div className=' center gap-3'>
        <Link className=' my-4 buttonbg' href="/barber/profile">Go to Profile</Link>
      <Link className=' my-4 buttonbg' href="/barber/queue">View Queue</Link>
      <Link className=' my-4 buttonbg' href="/barber/track">Manage Appointments</Link>
      </div>
     <BarberQueuePage/>
    </div>
  )
}

export default BarberMainPage