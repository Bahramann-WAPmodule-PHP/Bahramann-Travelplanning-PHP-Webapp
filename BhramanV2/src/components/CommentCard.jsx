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
    </div>
  )
}
