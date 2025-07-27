import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { apiRoute } from '../utils/apiRoute'; // update path if needed

export default function Card({ id, location, numerator, denominator, reviews = 0, scene }) {
  const navigate = useNavigate();
  const [fetchedReviews, setFetchedReviews] = useState([]);

  // Fetch reviews/comments from API on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiRoute.getComments}?location_id=${id}`);
        const result = await response.json();
        if (result.success) {
          setFetchedReviews(result.data); // save comments
        }
      } catch (err) {
        console.error('Fetch error (comments):', err);
      }
    };

    fetchComments();
  }, [id]);

  // Render stars based on numerator/denominator
  const renderStars = (top, bottom, size) => {
    if (bottom === 0) return <p className="text-sm text-gray-500">No rating yet</p>;

    const avgRating = Math.floor(top / bottom);
    return Array.from({ length: avgRating }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className="text-mainYellow"
        style={{ fontSize: size || '16px' }}
      />
    ));
  };

  return (
    <div className="w-[300px] h-[300px] bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-200">
      <div className="w-full h-full flex flex-col justify-between p-2">
        <img src={scene} alt={location} className="w-full h-[200px] rounded-[8px] object-cover" />
        <div className="flex justify-between items-end mt-2">
          <div>
            <h3 className="text-md font-semibold">{location}</h3>
            <div className="flex gap-1">{renderStars(numerator, denominator)}</div>
            <div className="text-darkBlue font-bold">
              {reviews + fetchedReviews.length} reviews
            </div>
          </div>
          <button
            className="button bg-mainRed text-white px-4 py-1 rounded transition"
            onClick={() => navigate(`/booking/${id}`)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
