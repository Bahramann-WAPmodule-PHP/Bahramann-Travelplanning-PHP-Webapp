import React from 'react'
export default function BookingCard({scene, location, room, date, price, people, hotel}) {
  return (
    <div className='w-9/10  bg-white shadow-lg rounded-lg p-4 flex justify-between'>
      <div className='flex gap-[10px]'>
      <img src= {scene} alt="" className='h-[200px] rounded-2xl'/>
        <div>
    <p className='font-bold text-2xl text-darkBlue'>{location}</p>
    <p className='text-darkBlue font-bold'>{hotel}</p>
    <p className='text-gray-400'>{date}</p>
    <p className='text-gray-400'>{room} room {people} adults</p>
      </div>
        </div>
      <div className='text-right'>
        <p className='font-bold text-2xl'>Rs.{price}</p>
        <p>{"fully paid"}</p>
      </div>

    </div>
  )
}
