import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMapMarkedAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import AdminNavBar from '../components/AdminNavBar';

// DashboardCard with group hover to switch bg and text colors
const DashboardCard = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="group flex-1 min-w-[250px] bg-white rounded-2xl shadow-lg p-8 
               flex flex-col items-center justify-center cursor-pointer 
               transition-colors duration-300 ease-in-out
               hover:bg-mainRed"
  >
    <div className="p-4 rounded-full mb-4
                    group-hover:bg-white/20">
      <FontAwesomeIcon
        icon={icon}
        className="text-5xl text-mainRed group-hover:text-white transition-colors duration-300"
      />
    </div>
    <h2 className="text-2xl font-bold text-mainRed group-hover:text-white mb-2 transition-colors duration-300">
      {title}
    </h2>
    <p className="text-center text-mainRed group-hover:text-white transition-colors duration-300">
      {description}
    </p>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
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

      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-mainRed mb-10 tracking-wide">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            icon={faUsers}
            title="Users"
            description="Manage all users and admins."
            onClick={() => navigate('/admin/users')}
          />
          <DashboardCard
            icon={faMapMarkedAlt}
            title="Locations"
            description="View and manage all travel locations."
            onClick={() =>
              document.getElementById('locations-table')?.scrollIntoView({ behavior: 'smooth' })
            }
          />
          <DashboardCard
            icon={faCalendarCheck}
            title="Bookings"
            description="Review and manage user bookings."
            onClick={() => navigate('/admin/bookings')}
          />
        </div>
      </div>
    </>
  );
}
