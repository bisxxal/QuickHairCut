'use client'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import UserQueue from './_components/userQueue'
import { MapPinCheck } from 'lucide-react'
import moment from 'moment'

const UserMainPage = () => {
  const [error, setError] = useState<string | null>(null)
 const [lat, setLat] = useState<number | null>(() => {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('lat');
    return val ? parseFloat(val) : null;
  }
  return null;
});

 const [long, setLong] = useState<number | null>(() => {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('long');
    return val ? parseFloat(val) : null;
  }
  return null;
}); 
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude );
          setLong(position.coords.longitude );
          localStorage.setItem('lat', position.coords.latitude.toString());
          localStorage.setItem('long', position.coords.longitude.toString());
          localStorage.setItem('userTime', new Date().toISOString());
          toast.success("Location fetched successfully.");
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
        },
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };


  return (
    <div className=' w-full min-h-full px-10 max-md:px-3'>
      <div className={` ${lat ? "  bg-green-400/30" : " card"} my-3 py-5 border rounded-3xl border-dashed `}>
        {!lat && !long && <button className='w-fit disabled:opacity-10 flex mx-auto buttonbg p-4 ' type="button" onClick={requestLocation}>
          Get Current Location
        </button>}
        {error && <p className='text-red-500 text-sm  text-bold text-center '>{error}</p>}
        {lat && long && <div className='text-center text-green-600 flex-col center gap-3'>
         <p className='center gap-1'> Location fetched successfully.<MapPinCheck /> </p>
         <p className='center text-sm gap-1'> Last updated on {moment(localStorage.getItem('userTime')).format('MMMM Do YYYY, h:mm a')} </p>
          <button className='buttonbg' onClick={() =>requestLocation() }>Update Location</button>
        </div>
        }
      </div>
      {lat && long && <UserQueue lat={lat} long={long} />}
      {  <UserQueue lat={lat} long={long} />}
    </div>
  )
}

export default UserMainPage
