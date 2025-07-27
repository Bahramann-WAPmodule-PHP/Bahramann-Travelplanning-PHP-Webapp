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
        <LocationTable />
      </div>
    </>
  );
}
