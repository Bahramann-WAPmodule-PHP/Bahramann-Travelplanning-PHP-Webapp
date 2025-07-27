import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingTable() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, bookingId: null, anchorIdx: null });

  const fetchBookings = () => {
    fetch('http://localhost/Bhramanapp/Backend/server/booking/get_bookings.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.bookings) {
          setBookings(data.bookings);
        }
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDeleteClick = (id, idx) => {
    setDeleteConfirm({ show: true, bookingId: id, anchorIdx: idx });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.bookingId;
    try {
      const res = await fetch('http://localhost/Bhramanapp/Backend/server/booking/delete_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
      } else {
        alert(data.error || 'Failed to delete booking.');
      }
    } catch (err) {
      alert('Failed to delete booking.');
    }
    setDeleteConfirm({ show: false, bookingId: null });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, bookingId: null });
  };

  return (
    <div className="w-full max-w-5xl mx-auto shadow-xl rounded-2xl bg-white p-6 border border-gray-200 mt-8 relative">
      <div className="flex items-center mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium shadow-sm border border-gray-200"
          onClick={() => navigate('/admin/dashboard')}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
          Back
        </button>
        <h2 className="text-2xl font-bold text-mainRed mb-0 ml-6">All Bookings</h2>
      </div>
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-red-100 text-mainRed">
              <th className="py-3 px-4 font-semibold text-left rounded-tl-xl">Booking ID</th>
              <th className="py-3 px-4 font-semibold text-left">User ID</th>
              <th className="py-3 px-4 font-semibold text-left">Location ID</th>
              <th className="py-3 px-4 font-semibold text-left">Vehicle Type</th>
              <th className="py-3 px-4 font-semibold text-left">People</th>
              <th className="py-3 px-4 font-semibold text-left">Date</th>
              <th className="py-3 px-4 font-semibold text-left rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">No bookings found.</td>
              </tr>
            ) : (
              bookings.map((booking, idx) => (
                <React.Fragment key={booking.booking_id}>
                  <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50 hover:bg-red-100 transition'}>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.booking_id}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.user_id}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.location_id}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.vehicle_type}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.number_of_people}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.booking_date}</td>
                    <td className="py-2 px-4 border-b border-gray-100 flex gap-2 items-center relative">
                      <button
                        className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 text-xs"
                        onClick={() => handleDeleteClick(booking.booking_id, idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirm.show && (
        <div
          id="delete-modal-overlay"
          onClick={e => { if (e.target.id === 'delete-modal-overlay') cancelDelete(); }}
          className="fixed w-screen h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50"
        >
          <div className="bg-white rounded-lg p-6 w-[300px] shadow-xl flex flex-col items-center gap-4 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-lg font-bold focus:outline-none"
              onClick={cancelDelete}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-base font-bold text-red-700 mb-3 text-center">Are you sure you want to delete this booking?</h3>
            <div className="flex gap-3 mt-1 flex-wrap justify-center">
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-semibold" onClick={confirmDelete}>Delete</button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded-lg font-semibold" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
