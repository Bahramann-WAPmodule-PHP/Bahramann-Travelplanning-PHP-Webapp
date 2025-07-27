import React, { useEffect, useState } from 'react';
import { apiRoute } from '../utils/apiRoute';

export default function LocationTable() {
  const [locations, setLocations] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, locationId: null, anchorIdx: null });

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
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchLocations();
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

  return (
    <div className="w-full max-w-5xl mx-auto shadow-xl rounded-2xl bg-white p-6 border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">All Locations</h2>
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="py-3 px-4 font-semibold text-left rounded-tl-xl">ID</th>
              <th className="py-3 px-4 font-semibold text-left">Title</th>
              <th className="py-3 px-4 font-semibold text-left">Description</th>
              <th className="py-3 px-4 font-semibold text-left rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">No locations found.</td>
              </tr>
            ) : (
              locations.map((loc, idx) => (
                <React.Fragment key={loc.id}>
                  <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                    <td className="py-2 px-4 border-b border-gray-100">{loc.id}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{loc.title}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{loc.description}</td>
                    <td className="py-2 px-4 border-b border-gray-100 flex gap-2 items-center relative">
                      <button
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 text-xs"
                        onClick={() => alert('Edit feature coming soon!')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m2-2l-6 6m2-2l6-6" /></svg>
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 text-xs"
                        onClick={() => handleDeleteClick(loc.id, idx)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Delete
                      </button>
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
  );
}
