import React from 'react';
import AdminNavBar from '../components/AdminNavBar';
import BookingTable from '../components/BookingTable';

export default function AdminBookings() {
  return (
    <>
      <AdminNavBar />
      <div className="p-8">
        <BookingTable />
      </div>
    </>
  );
}
