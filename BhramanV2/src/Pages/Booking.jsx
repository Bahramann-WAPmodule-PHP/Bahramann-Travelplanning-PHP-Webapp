import React, { useState, useEffect } from 'react';
import BookingCard from '../components/BookingCard.jsx';
import CommentCard from '../components/CommentCard.jsx';
import { useParams } from 'react-router-dom';
import { apiRoute } from '../utils/apiRoute.js';

export default function Booking() {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);

  // Static hotel placeholders for now
  const hotelOptions = [
    { value: 'Resort Placeholder 1' },
    { value: 'Resort Placeholder 2' },
    { value: 'To be updated...' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiRoute.getLocationDetail}?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch location details');
        const data = await response.json();
        console.log(data);
        setBookingData(data.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!bookingData) {
    return <div>Loading location details...</div>;
  }

  return (
    <div className='w-full flex flex-col justify-center items-center gap-2'>
      <BookingCard {...bookingData} hotelOptions={hotelOptions} />
      <div className='w-9/10 bg-white shadow-lg rounded-lg p-4 h-7/10 flex flex-col gap-5'>
        <textarea
          placeholder="Write a review..."
          className='rounded-lg p-4 h-20 resize-none border border-gray-300'
        />
        <button type="submit" className='bg-mainRed button self-end'>
          Submit Review
        </button>
      </div>
      <CommentCard name="John Doe" comment="Great experience!" likes="10" dislikes="2" />
      <CommentCard name="John Doe" comment="Great experience!" likes="10" dislikes="2" />
      <CommentCard name="John Doe" comment="Great experience!" likes="10" dislikes="2" />

    </div>
  );
}
