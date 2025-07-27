import React, { useEffect, useState } from 'react';
import { apiRoute } from '../utils/apiRoute';

export default function UserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost/Bhramanapp/Backend/server/auth/get_users.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users) {
          setUsers(data.users);
        }
      });
  }, []);

  // TODO: Implement CRUD actions (edit, delete, etc.)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.is_admin ? 'Admin' : 'User'}</td>
              <td className="py-2 px-4 border-b">
                {/* TODO: Add edit/delete actions */}
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
