import React, { useEffect, useState } from 'react';

export default function BookingTable() {
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
    <div className="w-full max-w-5xl mx-auto shadow-xl rounded-2xl bg-white p-6 border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">All Bookings</h2>
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
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
                  <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.booking_id}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.user_id}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.location_id}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.vehicle_type}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.number_of_people}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{booking.booking_date}</td>
                    <td className="py-2 px-4 border-b border-gray-100 flex gap-2 items-center relative">
                      <button className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 text-xs" onClick={() => handleDeleteClick(booking.booking_id, idx)}>Delete</button>
                      {/* No inline delete confirm, handled by modal below */}
      {/* Delete confirmation dropdown (inline, below the row, centered) */}
                      {deleteConfirm.show && deleteConfirm.bookingId === booking.booking_id && deleteConfirm.anchorIdx === idx && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-80 flex flex-col items-center animate-fade-in">
                          <h3 className="text-base font-bold text-red-700 mb-3 text-center break-words">Are you sure you want to delete this booking?</h3>
                          <div className="flex gap-3 mt-1 flex-wrap justify-center">
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-semibold" onClick={confirmDelete}>Delete</button>
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded-lg font-semibold" onClick={cancelDelete}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
