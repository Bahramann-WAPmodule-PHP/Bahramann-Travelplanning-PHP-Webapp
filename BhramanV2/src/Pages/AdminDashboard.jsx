
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

        {/* Quick Navigation Flex Boxes */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div
            className="flex-1 bg-gradient-to-br from-mainRed to-pink-400 rounded-xl shadow-lg p-8 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/admin/users')}
          >
            <span className="text-4xl mb-2 text-white"><i className="fas fa-users"></i></span>
            <h2 className="text-2xl font-semibold text-white mb-1">Users</h2>
            <p className="text-white text-center">Manage all users, admins, and perform CRUD operations.</p>
          </div>
          <div
            className="flex-1 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg p-8 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => document.getElementById('locations-table').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-4xl mb-2 text-white"><i className="fas fa-map-marked-alt"></i></span>
            <h2 className="text-2xl font-semibold text-white mb-1">Locations</h2>
            <p className="text-white text-center">View, add, and manage all travel locations.</p>
          </div>
          <div
            className="flex-1 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl shadow-lg p-8 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => document.getElementById('bookings-table').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-4xl mb-2 text-white"><i className="fas fa-calendar-check"></i></span>
            <h2 className="text-2xl font-semibold text-white mb-1">Bookings</h2>
            <p className="text-white text-center">Review and manage all bookings made by users.</p>
          </div>
        </div>

        {/* Only the flex box navigation remains as requested */}
      </div>
    </>
  );
}
