import React from 'react'
import BookingCard from '../components/BookingCard.jsx';
import scene from '../assets/Background/bgImage.jpg';
import CommentCard from '../components/CommentCard.jsx';

export default function Booking() {
const hotelOptions = [
  { value: "" },
  { value: "Mountain View Resort" },
  { value: "Beachside Hotel" },
  { value: "City Center Hotel" },
  { value: "Hilltop Hotel" },
  { value: "Luxury Hotel" }
];
  const fakeBookingData = {
    scene: scene,
    location: 'New York City',
    Description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    numerator: 4,
    denominator: 1,
    reviews: 100,
    hotelOptions: hotelOptions
  };

  return (
    <div className='w-full flex flex-col justify-center items-center gap-2'>
      <BookingCard {...fakeBookingData} />
      <div className='w-9/10 bg-white shadow-lg rounded-lg p-4 h-7/10 flex flex-col gap-5'>
            <textarea 
        placeholder="Write a review..." 
        className='rounded-lg p-4 flex flex-col gap-[10px] h-20 resize-none  border border-gray-300'  
      />
      <button 
        type="submit" 
        className='bg-mainRed button self-end'
      >
        Submit Review
      </button>

      </div>
      <CommentCard name="John Doe" comment="Great experience!" likes="10" dislikes="2"/>
    </div>
  );
}