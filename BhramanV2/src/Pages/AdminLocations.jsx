import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../components/AdminNavBar';
import LocationTable from '../components/LocationTable';
import { apiRoute } from '../utils/apiRoute';

export default function AdminLocations() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    hotel_names: '',
    hotel_prices: '',
    vehicle_type: '',
    initial_rating: '',
    image: null
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [refreshTable, setRefreshTable] = useState(false);

  const handleFormChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!form.title || !form.description || !form.hotel_names || !form.hotel_prices || !form.vehicle_type || !form.image) {
      setFormError('All fields are required.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('hotel_names', form.hotel_names);
      formData.append('hotel_prices', form.hotel_prices);
      formData.append('vehicle_type', form.vehicle_type);
      formData.append('initial_rating', form.initial_rating);
      formData.append('image', form.image);
      const res = await fetch(apiRoute.addLocation, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setForm({ title: '', description: '', image: null });
        setFormSuccess('Location added successfully!');
        setShowForm(false);
        setRefreshTable(v => !v);
      } else {
        setFormError(data.error || 'Failed to add location.');
      }
    } catch (err) {
      setFormError('Failed to add location.');
    }
  };

  return (
    <>
      <AdminNavBar />
      <div className="p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-medium shadow-sm transition"
              onClick={() => navigate('/admin/dashboard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2 ml-2"> 
              <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75' /></svg>
              Manage Locations
            </h1>
          </div>
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
            onClick={() => setShowForm(v => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            {showForm ? 'Close' : 'Add Location'}
          </button>
        </div>
        <div className="mb-8">
          {showForm && (
            <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 w-full max-w-lg mt-2" encType="multipart/form-data">
              <h3 className="text-lg font-bold text-blue-700 mb-4">Add New Location</h3>
              {formError && <div className="mb-2 text-red-500 text-sm">{formError}</div>}
              {formSuccess && <div className="mb-2 text-green-600 text-sm">{formSuccess}</div>}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" rows={3} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Hotel Names <span className="text-xs text-gray-400">(comma separated)</span></label>
                <input type="text" name="hotel_names" value={form.hotel_names} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Hotel A, Hotel B, ..." />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Hotel Prices <span className="text-xs text-gray-400">(comma separated, match order)</span></label>
                <input type="text" name="hotel_prices" value={form.hotel_prices} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="100, 200, ..." />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                <input type="text" name="vehicle_type" value={form.vehicle_type} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Car, Bus, ..." />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Initial Rating <span className="text-xs text-gray-400">(optional, 1-5)</span></label>
                <input type="number" name="initial_rating" min="1" max="5" value={form.initial_rating} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="4" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md transition">Add Location</button>
            </form>
          )}
        </div>
        <LocationTable key={refreshTable} />
      </div>
    </>
  );
}
