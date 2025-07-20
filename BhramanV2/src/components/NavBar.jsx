import React from "react";
import Logo from "../assets/logo/red.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function NavBar({ open, setOpen }) {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.LoginSlice.isLoggedIn);

  return (
    <nav className="w-full h-[75px] flex items-center justify-between px-4 bg-white shadow-md relative">
      <img src={Logo} alt="Logo" className="h-[50px]" />

      {isLoggedIn && (<div className="hidden md:flex items-center gap-8 text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
        <Link to="/" className="links" onClick={() => setOpen(false)}>
          Home
        </Link>
        <Link to="/Search" className="links" onClick={() => setOpen(false)}>
          Search Destination
        </Link>
        <Link to="/MyBookings" className="links" onClick={() => setOpen(false)}>
          My Bookings
        </Link>
      </div>
)}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <button className="hidden md:flex items-center gap-2 border border-gray-300 p-2 rounded-lg cursor-pointer">
            <FontAwesomeIcon
              icon={faUser}
              className="text-mainRed p-2 bg-white shadow-md rounded-full shadow-black/50"
            />
            Profile
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <button
              className="button bg-mainRed"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="button bg-mainRed"
              onClick={() => navigate("/signup")}
            >
              Register
            </button>
          </div>
        )}
        <div onClick={() => setOpen(!open)} className="md:hidden">
        {isLoggedIn ?         
        <button onClick={() => setOpen(!open)}>  <FontAwesomeIcon
            icon={faBars}
            className="text-2xl cursor-pointer text-mainRed"
          />
          </button>
        : (<div className="flex items-center gap-2">
            <button
              className="button bg-mainRed"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="button bg-mainRed"
              onClick={() => navigate("/signup")}
            >
              Register
            </button>
          </div>)}
        </div>
      </div>
    </nav>
  );
}
