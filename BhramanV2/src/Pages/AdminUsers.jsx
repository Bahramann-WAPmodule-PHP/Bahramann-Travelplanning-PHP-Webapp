import React from 'react';
import AdminNavBar from '../components/AdminNavBar';
import UserTable from '../components/UserTable';

export default function AdminUsers() {
  return (
    <>
      <AdminNavBar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">All Users</h1>
        <UserTable />
      </div>
    </>
  );
}
