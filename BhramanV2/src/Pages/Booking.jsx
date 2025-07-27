import React, { useState, useEffect } from 'react';
import BookingCard from '../components/BookingCard.jsx';
import CommentCard from '../components/CommentCard.jsx';
import { useParams, useSearchParams } from 'react-router-dom';
import { apiRoute } from '../utils/apiRoute.js';
import { useSelector } from 'react-redux';
import RateModal from '../components/RateModal.jsx';


export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editBookingId = searchParams.get('edit');
  const [bookingData, setBookingData] = useState(null);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [existingBookingData, setExistingBookingData] = useState(null);
  const user = useSelector((state) => state.LoginSlice.user);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiRoute.getLocationDetail}?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch location details');
        const data = await response.json();
        const hotelNames = data.data.hotel_names 
          ? data.data.hotel_names.split(',').map(hotel => hotel.trim())
          : [];
        const hotelPrices = data.data.hotel_prices 
          ? data.data.hotel_prices.split(',').map(price => price.trim())
          : [];
        const vehicleTypes = data.data.vehicle_type 
          ? data.data.vehicle_type.split(',').map(vehicle => vehicle.trim())
          : [];
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

    const fetchExistingBooking = async () => {
      if (!editBookingId) return;
      
      try {
        const response = await fetch(`${apiRoute.manageBookings}?booking_id=${editBookingId}`, {
          credentials: 'include'
        });
        const result = await response.json();
        if (result.success && result.data) {
          setExistingBookingData(result.data);
        }
      } catch (error) {
        console.error('Fetch error (existing booking):', error);
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
    fetchExistingBooking();
    fetchComments();
  }, [id, editBookingId]);

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
          name: user.username, // You can change this to a dynamic username if you have auth
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainRed mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading location details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col justify-center items-center gap-4 p-4'>
      <BookingCard 
        {...bookingData} 
        hotelOptions={hotelOptions} 
        vehicleOptions={vehicleOptions}
        isEditing={!!editBookingId}
        editBookingId={editBookingId}
        existingBookingData={existingBookingData}
        numReviews={comments.length}
      />
      
      <div className='w-9/10 bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-xl'>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Share Your Experience</h3>
        <textarea
          placeholder="Write a review about this location..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="rounded-lg p-4 h-24 resize-none border border-gray-300 focus:border-mainRed focus:ring-2 focus:ring-mainRed focus:ring-opacity-20 transition-all duration-200 outline-none"
        />
        <button 
          onClick={handleSubmit} 
          disabled={!commentText.trim()}
          className="bg-mainRed text-white px-6 py-2 rounded-lg self-end button disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform"
        >
          Submit Review
        </button>
      </div>
      
      <div className="w-full flex flex-col gap-4 items-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Reviews</h3>
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No reviews yet.</p>
            <p className="text-gray-400">Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">{comments.length} review{comments.length !== 1 ? 's' : ''}</p>
            {comments.map((comment, index) => (
              <CommentCard
                key={index}
                name={comment.name}
                comment={comment.comment}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
