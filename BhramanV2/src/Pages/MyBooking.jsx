import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiRoute } from '../utils/apiRoute';
import MyBookingsCard from '../components/MyBookingsCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const isLoggedIn = useSelector((state) => state.LoginSlice.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
    } else {
      fetchBookings();
    }
  }, [isLoggedIn]);

  // Auto-hide delete popup after 3 seconds
  useEffect(() => {
    if (showDeletePopup) {
      const timer = setTimeout(() => {
        setShowDeletePopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showDeletePopup]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching bookings from:', apiRoute.manageBookings);
      
      const response = await fetch(apiRoute.manageBookings, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setBookings(data.bookings);
      } else {
        const errorMsg = data.error || 'Failed to fetch bookings';
        console.error('API Error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = `Network error: ${err.message}`;
      console.error('Fetch bookings error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleBookingDeleted = (deletedBookingId) => {
    setShowDeletePopup(true);
    setBookings(prevBookings => 
      prevBookings.filter(booking => booking.booking_id !== deletedBookingId)
    );
  };

  const groupBookingsByLocation = (bookings) => {
    const grouped = {};
    bookings.forEach(booking => {
      if (!grouped[booking.location_name]) {
        grouped[booking.location_name] = [];
      }
      grouped[booking.location_name].push(booking);
    });
    return grouped;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Please log in to view your bookings</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-mainRed mb-4" />
          <p className="text-xl text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
          <p className="text-xl text-red-600 mb-4">Error Loading Bookings</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={fetchBookings}
              className="bg-mainRed text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500">
              Make sure you are logged in and XAMPP is running
            </p>
          </div>
        </div>
      </div>
    );
  }

  const groupedBookings = groupBookingsByLocation(bookings);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No bookings found</p>
            <p className="text-gray-500">Start exploring and book your next adventure!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBookings).map(([locationName, locationBookings]) => (
              <div key={locationName}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{locationName}</h2>
                <div className="space-y-4">
                  {locationBookings.map((booking) => (
                    <MyBookingsCard
                      key={booking.booking_id}
                      scene={booking.image_url}
                      location={locationName}
                      hotel={booking.hotel_name}
                      date={`${formatDate(booking.booking_date)} • ${booking.vehicle_type}`}
                      people={booking.number_of_people}
                      price={booking.total_price}
                      bookingId={booking.booking_id}
                      locationId={booking.location_id}
                      onBookingDeleted={handleBookingDeleted}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Success Popup */}
      {showDeletePopup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-down">
            <FontAwesomeIcon icon={faCheck} className="text-xl" />
            <span className="font-semibold text-lg">Your bookings is deleted.</span>
          </div>
        </div>
      )}
    </div>
  );
}
