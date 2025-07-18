import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


export default function Card({id, location, numerator, denominator, reviews, scene}) {
  const navigate = useNavigate();
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
    <div className='w-[300px] h-[300px] bg-white shadow-lg rounded-lg overflow-hidden'>
      <div className="w-full h-full flex flex-col justify-between p-2">
              <img src={scene} alt="" className='w-full h-[200px] rounded-[8px] object-cover' />
      <div className='flex justify-between items-end'>
        <div>
          {location}
          <div>{renderStars(numerator, denominator, "")}</div>
          <div className="text-darkBlue font-bold">{reviews} reviews</div>
        </div>
         <button className='button bg-mainRed' onClick={()=>navigate(`/booking/${id}`)}>Book Now</button></div>   
      </div>
    </div>
  )
}
