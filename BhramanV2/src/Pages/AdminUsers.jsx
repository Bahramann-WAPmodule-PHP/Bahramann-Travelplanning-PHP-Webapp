import React from 'react';
import AdminNavBar from '../components/AdminNavBar';
import UserTable from '../components/UserTable';

export default function AdminUsers() {
  return (
    <>
      <AdminNavBar />
      <div className="p-8">
        <UserTable />
      </div>
    </>
  );
}
