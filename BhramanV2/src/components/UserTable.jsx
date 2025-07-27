import React, { useEffect, useState } from 'react';
import { apiRoute } from '../utils/apiRoute';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ first_name: '', last_name: '', email: '', password: '', is_admin: false });
  const [addError, setAddError] = useState('');

  const fetchUsers = () => {
    fetch('http://localhost/Bhramanapp/Backend/server/users/get_users.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users) {
          setUsers(data.users);
        }
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  // Add user form handlers
  const handleAddChange = e => {
    const { name, value, type, checked } = e.target;
    setAddForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddSubmit = async e => {
    e.preventDefault();
    setAddError('');
    // Simple validation
    if (!addForm.first_name || !addForm.last_name || !addForm.email || !addForm.password) {
      setAddError('All fields are required.');
      return;
    }
    try {
      const res = await fetch('http://localhost/Bhramanapp/Backend/server/users/add_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setAddForm({ first_name: '', last_name: '', email: '', password: '', is_admin: false });
        fetchUsers();
      } else {
        setAddError(data.error || 'Failed to add user.');
      }
    } catch (err) {
      setAddError('Failed to add user.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full max-w-5xl shadow-xl rounded-2xl bg-white p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-medium shadow-sm transition"
              onClick={() => window.history.back()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 ml-2">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75' /></svg>
              All Users
            </h2>
          </div>
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
              type="button"
              onClick={() => setShowAddModal(v => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add User
            </button>
            {showAddModal && (
              <div className="absolute right-0 mt-2 z-50 bg-white rounded-xl shadow-2xl p-6 w-80 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-blue-700">Add New User</h3>
                  <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={() => setShowAddModal(false)}>&times;</button>
                </div>
                {addError && <div className="mb-2 text-red-500 text-sm">{addError}</div>}
                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input type="text" name="first_name" value={addForm.first_name} onChange={handleAddChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input type="text" name="last_name" value={addForm.last_name} onChange={handleAddChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" name="email" value={addForm.email} onChange={handleAddChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" name="password" value={addForm.password} onChange={handleAddChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_admin" checked={addForm.is_admin} onChange={handleAddChange} id="is_admin" />
                    <label htmlFor="is_admin" className="text-sm">Is Admin</label>
                  </div>
                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md transition">Add User</button>
                </form>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="py-3 px-4 font-semibold text-left rounded-tl-xl">ID</th>
                <th className="py-3 px-4 font-semibold text-left">Username</th>
                <th className="py-3 px-4 font-semibold text-left">Email</th>
                <th className="py-3 px-4 font-semibold text-left">Role</th>
                <th className="py-3 px-4 font-semibold text-left">Created At</th>
                <th className="py-3 px-4 font-semibold text-left rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No users found.</td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                    <td className="py-2 px-4 border-b border-gray-100">{user.id}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{user.username}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{user.email}</td>
                    <td className="py-2 px-4 border-b border-gray-100">
                      <span className={user.is_admin ? 'bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold' : 'bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold'}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-100">{user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</td>
                    <td className="py-2 px-4 border-b border-gray-100">
                      <button className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition font-medium shadow-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
