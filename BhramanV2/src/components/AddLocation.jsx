import React, { useState } from 'react';
import { apiRoute } from '../utils/apiRoute';

export default function AddLocation({ onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    // Add more fields as needed
    try {
      const res = await fetch(apiRoute.addLocation, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Location added successfully!');
        setName('');
        setDescription('');
        if (onSuccess) onSuccess();
      } else {
        setMessage(data.message || 'Failed to add location.');
      }
    } catch (err) {
      setMessage('Error adding location.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label className="block mb-1">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="border px-2 py-1 w-full" required />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="border px-2 py-1 w-full" required />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Add Location</button>
      {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
    </form>
  );
}
