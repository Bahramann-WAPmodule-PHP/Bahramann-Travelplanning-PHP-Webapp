//  RateModal.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function RateModal({ isOpen, setIsOpen, onSubmit }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hover, setHover] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedRating === 0) return;
    onSubmit(selectedRating);
    setIsOpen(false);
    setSelectedRating(0);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      setIsOpen(false);
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed w-screen h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-[300px] shadow-xl flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold">Rate this location</h2>
        <div className="flex gap-2">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setSelectedRating(ratingValue)}
                  className="hidden"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  size="2x"
                  color={
                    ratingValue <= (hover || selectedRating)
                      ? '#ffc107'
                      : '#e4e5e9'
                  }
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer"
                />
              </label>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-mainRed text-white rounded-md"
        >
          Submit
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
