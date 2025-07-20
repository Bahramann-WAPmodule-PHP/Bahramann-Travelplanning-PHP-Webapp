// import React, { useState, useEffect } from 'react';
// import BookingCard from '../components/BookingCard.jsx';
// import CommentCard from '../components/CommentCard.jsx';
// import { useParams } from 'react-router-dom';
// import { apiRoute } from '../utils/apiRoute.js';

// export default function Booking() {
//   const { id } = useParams();
//   const [bookingData, setBookingData] = useState(null);

//   // Static hotel placeholders for now
//   const hotelOptions = [
//     { value: 'Resort Placeholder 1' },
//     { value: 'Resort Placeholder 2' },
//     { value: 'To be updated...' },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${apiRoute.getLocationDetail}?id=${id}`);
//         if (!response.ok) throw new Error('Failed to fetch location details');
//         const data = await response.json();
//         console.log(data);
//         setBookingData(data.data);
//       } catch (error) {
//         console.error('Fetch error:', error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (!bookingData) {
//     return <div>Loading location details...</div>;
//   }

//   return (
//     <div className='w-full flex flex-col justify-center items-center gap-2'>
//       <BookingCard {...bookingData} hotelOptions={hotelOptions} />
//       <div className='w-9/10 bg-white shadow-lg rounded-lg p-4 h-7/10 flex flex-col gap-5'>
//         <textarea
//           placeholder="Write a review..."
//           className='rounded-lg p-4 h-20 resize-none border border-gray-300'
//         />
//         <button type="submit" className='bg-mainRed button self-end'>
//           Submit Review
//         </button>
//       </div>
//       <CommentCard name="John Doe" comment="Great experience!" likes="10" dislikes="2" />
//       <CommentCard name="John Doe" comment="Great experience!" likes="10" dislikes="2" />
//       <CommentCard name="John Doe" comment="Great experience!" likes="10" dislikes="2" />

//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import BookingCard from '../components/BookingCard.jsx';
import CommentCard from '../components/CommentCard.jsx';
import { useParams } from 'react-router-dom';
import { apiRoute } from '../utils/apiRoute.js';

export default function Booking() {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiRoute.getLocationDetail}?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch location details');
        const data = await response.json();
        // Parse hotel names and prices from comma-separated strings
        const hotelNames = data.data.hotel_names 
          ? data.data.hotel_names.split(',').map(hotel => hotel.trim())
          : [];
        const hotelPrices = data.data.hotel_prices 
          ? data.data.hotel_prices.split(',').map(price => price.trim())
          : [];
        const vehicleTypes = data.data.vehicle_type 
          ? data.data.vehicle_type.split(',').map(vehicle => vehicle.trim())
          : [];
        // Combine hotel names with their corresponding prices
        const hotels = hotelNames.map((hotel, index) => ({
          value: hotel,
          price: hotelPrices[index] || 'N/A'
        }));
        const vehicles = vehicleTypes.map(vehicle => ({ value: vehicle }));
        setBookingData(data.data);
        setHotelOptions(hotels);
        setVehicleOptions(vehicles);
      } catch (error) {
        console.error('Fetch error (location):', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiRoute.getComments}?location_id=${id}`);
        const result = await response.json();
        if (result.success) {
          setComments(result.data);
        }
      } catch (err) {
        console.error('Fetch error (comments):', err);
      }
    };

    fetchData();
    fetchComments();
  }, [id]);

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await fetch(apiRoute.addComment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_id: id,
          name: 'Anonymous', // You can change this to a dynamic username if you have auth
          comment: commentText,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setComments(prev => [result.data, ...prev]); // Add the new comment to the top
        setCommentText('');
      } else {
        console.error('Submit failed:', result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  if (!bookingData) {
    return <div>Loading location details...</div>;
  }

  return (
    <div className='w-full flex flex-col justify-center items-center gap-2'>
      <BookingCard {...bookingData} hotelOptions={hotelOptions} vehicleOptions={vehicleOptions} />
      <div className='w-9/10 bg-white shadow-lg rounded-lg p-4 h-7/10 flex flex-col gap-5'>
        <textarea
          placeholder="Write a review..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="rounded-lg p-4 h-20 resize-none border border-gray-300"
        />
        <button onClick={handleSubmit} className="bg-mainRed text-white px-4 py-2 rounded-lg self-end">
          Submit Review
        </button>
      </div>
      {/* Comments Section */}
      <div className="w-9/10 flex flex-col gap-3">
        {comments.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to comment!</p>
        ) : (
          comments.map((comment, index) => (
            <CommentCard
              key={index}
              name={comment.name}
              comment={comment.comment}
              likes={comment.likes || 0}
              dislikes={comment.dislikes || 0}
            />
          ))
        )}
      </div>
    </div>
  );
}
