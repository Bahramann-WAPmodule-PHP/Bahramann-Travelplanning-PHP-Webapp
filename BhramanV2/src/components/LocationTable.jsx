import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { apiRoute } from '../utils/apiRoute';

export default function LocationTable() {
  const [locations, setLocations] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, locationId: null, anchorIdx: null });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    hotel_names: '',
    hotel_prices: '',
    vehicle_type: '',
    initial_rating: '',
    image: null
  });
  const [addFormError, setAddFormError] = useState('');
  const [addFormSuccess, setAddFormSuccess] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    description: '',
    hotel_names: '',
    hotel_prices: '',
    vehicle_type: '',
    initial_rating: '',
    image: null
  });
  const [editFormError, setEditFormError] = useState('');
  const [editFormSuccess, setEditFormSuccess] = useState('');

  const fetchLocations = () => {
    fetch(apiRoute.getLocations)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setLocations(data.data);
        }
      });
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDeleteClick = (id, idx) => {
    setDeleteConfirm({ show: true, locationId: id, anchorIdx: idx });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.locationId;
    try {
      const res = await fetch(apiRoute.deleteLocation, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location_id: id })
      });
      const data = await res.json();
      if (data.success) {
        // Remove the deleted location from local state for instant UI update
        setLocations(prev => prev.filter(loc => loc.id !== id && loc.location_id !== id));
      } else {
        alert(data.error || 'Failed to delete location.');
      }
    } catch (err) {
      alert('Failed to delete location.');
    }
    setDeleteConfirm({ show: false, locationId: null });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, locationId: null });
  };

  // Add Location form handlers
  const handleAddFormChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setAddForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setAddForm(f => ({ ...f, [name]: value }));
    }
  };

  // Edit Location form handlers
  const handleEditFormChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setEditForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setEditForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAddFormSubmit = async e => {
    e.preventDefault();
    setAddFormError('');
    setAddFormSuccess('');
    if (!addForm.title || !addForm.description || !addForm.hotel_names || !addForm.hotel_prices || !addForm.vehicle_type || !addForm.image) {
      setAddFormError('All fields are required.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', addForm.title);
      formData.append('description', addForm.description);
      formData.append('hotel_names', addForm.hotel_names);
      formData.append('hotel_prices', addForm.hotel_prices);
      formData.append('vehicle_type', addForm.vehicle_type);
      formData.append('initial_rating', addForm.initial_rating);
      formData.append('image', addForm.image);
      const res = await fetch(apiRoute.addLocation, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setAddForm({ title: '', description: '', hotel_names: '', hotel_prices: '', vehicle_type: '', initial_rating: '', image: null });
        setAddFormSuccess('Location added successfully!');
        setShowAddModal(false);
        fetchLocations();
      } else {
        setAddFormError(data.error || 'Failed to add location.');
      }
    } catch (err) {
      setAddFormError('Failed to add location.');
    }
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-full max-w-5xl shadow-xl rounded-2xl bg-white p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow-sm transition flex items-center gap-2 mr-2"
              type="button"
              onClick={() => window.history.back()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <h2 className="text-2xl font-bold text-mainRed flex items-center gap-2 ml-2">
              <FontAwesomeIcon icon={faMapMarkedAlt} />All Locations
            </h2>
          </div>
          <div className="flex justify-end">
            <button
              className="button bg-mainRed flex items-center gap-2 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
              type="button"
              onClick={() => setShowAddModal(true)}
            >
              <span className="text-xl font-bold">+</span>
              Add Location
            </button>
          </div>
        </div>

        {/* Add Location Modal */}
        {showAddModal && (
          <div className="fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200 w-full max-w-lg mt-8 relative animate-fade-in pointer-events-auto max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold text-mainRed mb-4">Add New Location</h3>
              {addFormError && <div className="mb-2 text-red-500 text-sm">{addFormError}</div>}
              {addFormSuccess && <div className="mb-2 text-green-600 text-sm">{addFormSuccess}</div>}
              <form onSubmit={handleAddFormSubmit} encType="multipart/form-data" className="space-y-3">
                {/* ...existing code for add form fields... */}
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input type="text" name="title" value={addForm.title} onChange={handleAddFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea name="description" value={addForm.description} onChange={handleAddFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel Names <span className="text-xs text-gray-400">(comma separated)</span></label>
                  <input type="text" name="hotel_names" value={addForm.hotel_names} onChange={handleAddFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="Hotel A, Hotel B, ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel Prices <span className="text-xs text-gray-400">(comma separated, match order)</span></label>
                  <input type="text" name="hotel_prices" value={addForm.hotel_prices} onChange={handleAddFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="100, 200, ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <input type="text" name="vehicle_type" value={addForm.vehicle_type} onChange={handleAddFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="Car, Bus, ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Rating <span className="text-xs text-gray-400">(optional, 1-5)</span></label>
                  <input type="number" name="initial_rating" min="1" max="5" value={addForm.initial_rating} onChange={handleAddFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="4" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input type="file" name="image" accept="image/*" onChange={handleAddFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" />
                </div>
                <button type="submit" className="w-full bg-mainRed hover:bg-red-600 text-white py-2 rounded-lg font-semibold shadow-md transition">Add Location</button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Location Modal */}
        {showEditModal && (
          <div className="fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200 w-full max-w-lg mt-8 relative animate-fade-in pointer-events-auto max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => setShowEditModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold text-mainRed mb-4">Edit Location</h3>
              {editFormError && <div className="mb-2 text-red-500 text-sm">{editFormError}</div>}
              {editFormSuccess && <div className="mb-2 text-green-600 text-sm">{editFormSuccess}</div>}
              <form onSubmit={async e => {
                e.preventDefault();
                setEditFormError('');
                setEditFormSuccess('');
                if (!editForm.title || !editForm.description || !editForm.hotel_names || !editForm.hotel_prices || !editForm.vehicle_type) {
                  setEditFormError('All fields except image are required.');
                  return;
                }
                try {
                  const formData = new FormData();
                  formData.append('id', editForm.id);
                  formData.append('title', editForm.title);
                  formData.append('description', editForm.description);
                  formData.append('hotel_names', editForm.hotel_names);
                  formData.append('hotel_prices', editForm.hotel_prices);
                  formData.append('vehicle_type', editForm.vehicle_type);
                  formData.append('initial_rating', editForm.initial_rating);
                  if (editForm.image) formData.append('image', editForm.image);
                  const res = await fetch(apiRoute.editLocation, {
                    method: 'POST',
                    body: formData
                  });
                  const data = await res.json();
                  if (data.success) {
                    setEditFormSuccess('Location updated successfully!');
                    setShowEditModal(false);
                    fetchLocations();
                  } else {
                    setEditFormError(data.error || 'Failed to update location.');
                  }
                } catch (err) {
                  setEditFormError('Failed to update location.');
                }
              }} encType="multipart/form-data" className="space-y-3">
                {/* ...existing code for edit form fields... */}
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input type="text" name="title" value={editForm.title} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea name="description" value={editForm.description} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel Names <span className="text-xs text-gray-400">(comma separated)</span></label>
                  <input type="text" name="hotel_names" value={editForm.hotel_names} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="Hotel A, Hotel B, ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel Prices <span className="text-xs text-gray-400">(comma separated, match order)</span></label>
                  <input type="text" name="hotel_prices" value={editForm.hotel_prices} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="100, 200, ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <input type="text" name="vehicle_type" value={editForm.vehicle_type} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="Car, Bus, ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Rating <span className="text-xs text-gray-400">(optional, 1-5)</span></label>
                  <input type="number" name="initial_rating" min="1" max="5" value={editForm.initial_rating} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="4" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image <span className="text-xs text-gray-400">(leave blank to keep current)</span></label>
                  <input type="file" name="image" accept="image/*" onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200" />
                </div>
                <button type="submit" className="w-full bg-mainRed hover:bg-red-600 text-white py-2 rounded-lg font-semibold shadow-md transition">Update Location</button>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-red-100 text-mainRed">
                <th className="py-3 px-4 font-semibold text-left rounded-tl-xl">ID</th>
                <th className="py-3 px-4 font-semibold text-left">Title</th>
                <th className="py-3 px-4 font-semibold text-left">Description</th>
                <th className="py-3 px-4 font-semibold text-left">Hotel Names</th>
                <th className="py-3 px-4 font-semibold text-left">Hotel Prices</th>
                <th className="py-3 px-4 font-semibold text-left">Vehicle Type</th>
                <th className="py-3 px-4 font-semibold text-left rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">No locations found.</td>
                </tr>
              ) : (
                locations.map((loc, idx) => (
                  <React.Fragment key={loc.id}>
                    <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50 hover:bg-red-100 transition'}>
                      <td className="py-2 px-4 border-b border-gray-100">{loc.id}</td>
                      <td className="py-2 px-4 border-b border-gray-100">{loc.title}</td>
                      <td className="py-2 px-4 border-b border-gray-100">{loc.description}</td>
                      <td className="py-2 px-4 border-b border-gray-100">{loc.hotel_names}</td>
                      <td className="py-2 px-4 border-b border-gray-100">{loc.hotel_prices}</td>
                      <td className="py-2 px-4 border-b border-gray-100">{loc.vehicle_type}</td>
                      <td className="py-2 px-4 border-b border-gray-100 flex gap-2 items-center relative">
                        <button
                          className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 text-xs"
                          onClick={() => {
                            setEditForm({
                              id: loc.id,
                              title: loc.title,
                              description: loc.description,
                              hotel_names: loc.hotel_names || '',
                              hotel_prices: loc.hotel_prices || '',
                              vehicle_type: loc.vehicle_type || '',
                              initial_rating: loc.initial_rating || '',
                              image: null
                            });
                            setEditFormError('');
                            setEditFormSuccess('');
                            setShowEditModal(true);
                          }}
                        >Edit</button>
                        <button
                          className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 text-xs"
                          onClick={() => handleDeleteClick(loc.id, idx)}
                        >Delete</button>
                        {deleteConfirm.show && deleteConfirm.locationId === loc.id && deleteConfirm.anchorIdx === idx && (
                          <div id="location-delete-modal-overlay" className="fixed w-screen h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50">
                            <div className="bg-white rounded-lg p-6 w-[300px] shadow-xl flex flex-col items-center gap-4 relative animate-fade-in">
                              <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-lg font-bold focus:outline-none"
                                onClick={cancelDelete}
                                aria-label="Close"
                              >
                                &times;
                              </button>
                              <h3 className="text-base font-bold text-red-700 mb-3 text-center">Are you sure you want to delete this location?</h3>
                              <div className="flex gap-3 mt-1 flex-wrap justify-center">
                                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-semibold" onClick={confirmDelete}>Delete</button>
                                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded-lg font-semibold" onClick={cancelDelete}>Cancel</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
