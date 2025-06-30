import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './Pages/Signup.jsx'
import Login from './Pages/Login.jsx'
import AllRoutes from './Pages/AllRoutes.jsx'

export default function Index() {


  return (
    <Router>
        <Routes>
          <Route path="*" element={<AllRoutes/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
  )
}
