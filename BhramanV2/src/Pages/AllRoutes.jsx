import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../redux/feature/LoginSlice";
import Home from "./Home.jsx";
import NavBar from "../components/NavBar.jsx";
import Modal from "../components/Modal.jsx";
import SearchLocation from "./SearchLocation.jsx";
import { apiRoute } from "../utils/apiRoute.js";
import Booking from "./Booking.jsx";
export default function AppRoutes() {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(apiRoute.login, {
          method: "GET",
          credentials: 'include', // Include cookies for remember me
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (data.isLoggedIn) {
          dispatch(setLoggedIn(true));
        }
      } catch (error) {
        console.error("Session check failed:", error);
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
          <Route path="/booking/:id" element={<Booking />} />
        </Routes>
      </div>
    </>
  );
}
