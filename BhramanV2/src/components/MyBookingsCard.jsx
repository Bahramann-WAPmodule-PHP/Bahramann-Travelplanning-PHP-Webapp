import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEdit, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { apiRoute } from '../utils/apiRoute';

export default function MyBookingsCard({scene, location, hotel, date, people, price, bookingId, locationId, onBookingDeleted}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toLocaleString() : price;
  };

  const handleEdit = () => {
    setShowDropdown(false);
    // Navigate to booking page with location ID for editing
    navigate(`/booking/${locationId}?edit=${bookingId}`);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);

    try {
      const response = await fetch(apiRoute.manageBookings, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Call parent component to refresh bookings list and show popup
        setTimeout(() => {
          if (onBookingDeleted) {
            onBookingDeleted(bookingId);
          }
        }, 100); // Small delay to ensure smooth transition
      } else {
        alert('Failed to delete booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete booking error:', error);
      alert('Error deleting booking. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/160x120/e2e8f0/64748b?text=No+Image';
    
    // If it's already a full URL, use it
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // For debugging, let's also log the original image URL
    console.log('Processing image URL:', imageUrl);
    
    // Try multiple patterns in order of likelihood
    const patterns = [
      `/api/bhramanapp/backend/${imageUrl}`, // Original pattern from BookingCard
      `http://localhost/Bhramanapp/Backend/${imageUrl}`, // Direct localhost
      `http://localhost/Bhramanapp/Backend/uploads/${imageUrl}`, // Uploads folder
      imageUrl // Original as-is (in case it's already correct)
    ];
    
    // For now, use the direct localhost pattern
    if (imageUrl.startsWith('/api/')) {
      return imageUrl;
    }
    
    // Remove any leading slashes and use direct path
    const cleanUrl = imageUrl.replace(/^\/+/, '');
    return `http://localhost/Bhramanapp/Backend/${cleanUrl}`;
  };

  return (
    <div className='w-full bg-white shadow-lg rounded-lg p-4 flex justify-between items-center'>
      <div className='flex gap-4'>
        <img 
          src={getImageUrl(scene)} 
          alt={location}
          className='h-[120px] w-[160px] rounded-lg object-cover'
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/160x120/e2e8f0/64748b?text=No+Image';
          }}
        />
        <div className='flex flex-col justify-center'>
          <p className='font-bold text-xl text-gray-800'>{hotel}</p>
          <p className='text-gray-600 text-sm mb-1'>{location}</p>
          <p className='text-gray-500 text-sm'>{date}</p>
          <p className='text-gray-500 text-sm'>1 room • {people} adults</p>
        </div>
      </div>
      
      <div className='flex flex-col items-end'>
        <div className='text-right mb-2'>
          <p className='font-bold text-xl text-gray-800'>Rs. {formatPrice(price)}</p>
          <p className='text-red-400 text-sm font-medium'>Payment pending</p>
        </div>
        <div className='relative' ref={dropdownRef}>
          <button 
            className='text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors'
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
          
          {showDropdown && (
            <div className='absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
              <button
                onClick={handleEdit}
                className='w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 rounded-t-lg text-gray-700 hover:text-blue-600 transition-colors'
              >
                <FontAwesomeIcon icon={faEdit} className='text-sm' />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-red-50 rounded-b-lg text-gray-700 hover:text-red-600 transition-colors disabled:opacity-50'
              >
                <FontAwesomeIcon icon={faTrashAlt} className='text-sm' />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Booking</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this booking? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
