
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../components/AdminNavBar';
import LocationTable from '../components/LocationTable';
import AddLocation from '../components/AddLocation';
import UserTable from '../components/UserTable';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Check if admin is logged in (replace with your real auth/session check)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.is_admin) {
      navigate('/login');
    } else {
      setAdmin(user);
    }
  }, [navigate]);

  return (
    <>
      <AdminNavBar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">All Locations</h2>
          <LocationTable />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Add Location</h2>
          <AddLocation onSuccess={() => window.location.reload()} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">All Users</h2>
          <UserTable />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">All Bookings</h2>
          {/* TODO: Table of bookings with delete buttons */}
          <p>Bookings table goes here.</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">All Comments</h2>
          {/* TODO: Table of comments with delete buttons */}
          <p>Comments table goes here.</p>
        </div>
        {/* The logout button is now in the navbar profile dropdown */}
      </div>
    </>
  );
}
