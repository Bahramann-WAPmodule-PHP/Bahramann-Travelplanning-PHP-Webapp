import Card from './components/Card.jsx'
import CommentCard from './components/CommentCard.jsx'
import BookingCard from './components/BookingCard.jsx'
import scene from './assets/download.jpeg'
import './App.css'
import Index from './Index.jsx'
import Signup from './Pages/Signup.jsx'
import Login from './Pages/Login.jsx'
import Modal from './components/Modal.jsx'
import React from 'react'
import NavBar from './components/NavBar.jsx'
import Home from './Pages/Home.jsx'
function App() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className='w-full h-full flex items-center justify-center bg-gray-100 overflow-x-hidden'>
      <NavBar open= {open}  setOpen = {setOpen}/>
      <Modal open={open} setOpen={setOpen}/>
      <div className='w-full h-full pt-[80px]'>
      <Home/>
      </div>
    </div>
  )
}

export default App
