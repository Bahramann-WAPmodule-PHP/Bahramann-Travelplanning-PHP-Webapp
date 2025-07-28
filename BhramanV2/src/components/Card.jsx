import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { apiRoute } from '../utils/apiRoute'; // update path if needed
import { useSelector } from 'react-redux';

export default function Card({ id, location, numerator, denominator, reviews = 0, scene }) {
  const navigate = useNavigate();
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const isLoggedIn = useSelector((state) => state.LoginSlice.isLoggedIn);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCardClick = () => {
    if (isLoggedIn) {
      navigate(`/booking/${id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  const goToLogin = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  // Fetch reviews/comments from API on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiRoute.getComments}?location_id=${id}`);
        const result = await response.json();
        if (result.success) {
          setFetchedReviews(result.data);
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
    <>
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
              onClick={handleCardClick}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="mb-6">You need to be logged in to book a tour.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={goToLogin}
                className="bg-mainRed text-white px-4 py-2 rounded button transition"
              >
                Go to Login
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
