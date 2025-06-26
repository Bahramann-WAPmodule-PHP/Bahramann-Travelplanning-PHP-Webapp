import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons';
export default function CommentCard({name, comment, likes, dislikes}) {
  return (
    <div className='w-9/10  bg-white shadow-lg rounded-lg p-4 flex flex-col gap-[10px]'>
      <p className="text-darkBlue font-bold text-2xl">
        {name}
      </p>
      <p>
        {comment}
      </p>
      <div className='text-darkBlue font-bold flex items-center gap-2 text-[1rem]'>
        <FontAwesomeIcon icon={faThumbsUp} className='text-gray-400 text-[1.5rem]'/>
        {likes}
        <FontAwesomeIcon icon={faThumbsDown} className='text-gray-400 text-[1.5rem]' />
        {dislikes}
      </div>
    </div>
  )
}
