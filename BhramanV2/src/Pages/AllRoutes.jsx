import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedIn, setUser } from "../redux/feature/LoginSlice";
import Home from "./Home.jsx";
import NavBar from "../components/NavBar.jsx";
import Modal from "../components/Modal.jsx";
import SearchLocation from "./SearchLocation.jsx";
import MyBooking from "./MyBooking.jsx";
import { apiRoute } from "../utils/apiRoute.js";
import Booking from "./Booking.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsers from "./AdminUsers.jsx";
import AdminBookings from "./AdminBookings.jsx";
import AdminLocations from "./AdminLocations.jsx";

export default function AppRoutes() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(apiRoute.getUser, {
          method: "GET",
          credentials: "include", // Include cookies for remember me
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (data.success && data.user) {
          dispatch(setLoggedIn(true));
          dispatch(setUser(data.user));
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();
  }, [dispatch]);

  // Only show NavBar and Modal if not on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <NavBar open={open} setOpen={setOpen} />}
      {!isAdminRoute && <Modal open={open} setOpen={setOpen} />}
      <div className={!isAdminRoute ? "pt-[75px]" : undefined}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchLocation />} />
          <Route path="/MyBookings" element={<MyBooking />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/locations" element={<AdminLocations />} />
        </Routes>
      </div>
    </>
  );
}
