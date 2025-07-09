import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedIn} from '../redux/feature/LoginSlice';
import Home from './Home.jsx';
import NavBar from '../components/NavBar.jsx';
import Modal from '../components/Modal.jsx';
import SearchLocation from './SearchLocation.jsx';

export default function AppRoutes() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/samir/main.php', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        const data = await response.json();
        if (data.isLoggedIn) {
          dispatch(setLoggedIn(true));
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();
  }, [dispatch]);

  return (
    <>
      <NavBar open={open} setOpen={setOpen} />
      <Modal open={open} setOpen={setOpen} />
      <div className="pt-[75px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchLocation />} />
        </Routes>
      </div>
    </>
  );
}
