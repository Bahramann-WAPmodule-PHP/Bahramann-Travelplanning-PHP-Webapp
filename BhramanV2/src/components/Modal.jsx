import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Logout from './Logout'

export default function Modal({ open, setOpen }) {
  return (
    <div>
      <div
        className={
          'fixed inset-0 justify-self-end flex flex-col items-start bg-white h-[100vh] z-50  w-7/10 md:w-2/10 sm:w-3/10 shadow-lg transition-transform duration-300 ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
      >
        <button className="self-end m-4">
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-2xl cursor-pointer text-mainRed"
            onClick={() => setOpen(false)}
          />
        </button>
        <nav className="flex flex-col gap-6 mt-8 w-full">
          <Link to="/" className="links" onClick={() => setOpen(false)}>
            Home
          </Link>
            <Link to="/Search" className="links" onClick={() => setOpen(false)}>
            Search Destination
          </Link>
          <Link to="/MyBookings" className="links" onClick={() => setOpen(false)}>
            My Bookings
          </Link>
          <Logout />
        </nav>
      </div>
    </div>
  )
}
