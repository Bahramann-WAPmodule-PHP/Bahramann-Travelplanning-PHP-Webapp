import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Modal({open, setOpen}) {;
  return (
<div>
    <div
      className={
        'fixed inset-0 justify-self-end flex items-center justify-center bg-white h-[100vh] z-50 w-1/2  md:w-2/10 sm:w-3/10 shadow-lg transition-transform duration-300 ' +
        (open ? 'translate-x-0' : 'translate-x-full')
      }
    >
      <button>
        <FontAwesomeIcon
          icon={faArrowRight}
          className="text-2xl cursor-pointer text-mainRed absolute top-4 right-4"
          onClick={() => setOpen(false)}
        />
      </button>
    </div>
</div>
  )
}
