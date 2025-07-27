import React, { useEffect, useState } from 'react';
import { apiRoute } from '../utils/apiRoute';

export default function LocationTable() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch(apiRoute.getLocations)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setLocations(data.data);
        }
      });
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(loc => (
            <tr key={loc.id}>
              <td className="py-2 px-4 border-b">{loc.id}</td>
              <td className="py-2 px-4 border-b">{loc.title}</td>
              <td className="py-2 px-4 border-b">{loc.description}</td>
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
