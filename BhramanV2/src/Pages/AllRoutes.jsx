import React,{useState} from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import NavBar from '../components/NavBar.jsx'
import Modal from '../components/Modal.jsx'
import SearchLocation from './SearchLocation.jsx'

export default function AppRoutes() {
      const [open, setOpen] = useState(false)
  return (
    <>
    <NavBar/>
        <NavBar open={open} setOpen={setOpen} />
        <Modal open={open} setOpen={setOpen} />
    <div className="pt-[75px]">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchLocation />} />
    </Routes>
    </div>
    </>

  )
}