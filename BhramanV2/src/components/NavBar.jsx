import React,{useState}from 'react'
import Logo from '../assets/logo/red.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
export default function NavBar({ open, setOpen }) {
  return (
    <nav className='fixed top-0 w-full h-[75px] flex items-center justify-between p-4 bg-white shadow-md z-50'>
      <img src={Logo} alt="" className='h-[50px]' />
        <button  onClick={()=> setOpen(!open)}>
          <FontAwesomeIcon icon={faBars} className="text-2xl cursor-pointer text-mainRed" />
        </button>
    </nav>
  )
}
