import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
export default function BookingCard({ scene, location, numerator, denominator, reviews, Description}) {
   const renderStars = (top, bottom, size) => {
      if (bottom === 0) {
        return <p>No rating till now</p>;
      }
  
      const averageRating = Math.floor(top / bottom);
      const stars = [];
      for (let i = 0; i < averageRating; i++) {
        stars.push(<FontAwesomeIcon key = {i} icon={faStar} className='text-mainYellow' style={{fontSize: size}}/>);
      }
      return stars;
    };
  return (
    <div className='w-9/10 bg-white shadow-lg rounded-lg p-4 h-7/10 flex gap-5'>
      <img src={scene} alt={location} className='w-6/10 h-full rounded-2xl' />
    <div>
        <h1 className='text-4xl font-bold'>{location}</h1>
      <div>{renderStars(numerator, denominator, "1.5rem")} <span className='text-darkBlue font-bold text-2xl'>{reviews} Reviews</span></div>
    <p className='text-gray-500 mt-2'>{Description}</p>
</div>

    </div>
  );
}
