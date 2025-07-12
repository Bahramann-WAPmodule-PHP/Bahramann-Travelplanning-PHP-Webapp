import React,{useState}from 'react'
import Logo from '../assets/logo/red.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
export default function NavBar({ open, setOpen }) {
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.LoginSlice.isLoggedIn)
  return (
    <nav className='w-full h-[75px] flex items-center justify-between p-4 bg-white shadow-md'>
      <img src={Logo} alt="" className='h-[50px]' />

      <div className='flex items-center gap-4'>
        {isLoggedIn ? ("") : (<div className="flex items-center gap-2"><button className='button bg-mainRed' onClick={()=>navigate("/login")}>Login</button> <span className='text-mainRed'></span> <button className='button bg-mainRed' onClick={()=>navigate("/signup")}>Register</button></div>)}
        <button  onClick={()=> setOpen(!open)}>
          <FontAwesomeIcon icon={faBars} className="text-2xl cursor-pointer text-mainRed" />
        </button>
      </div>
    </nav>
  )
}
