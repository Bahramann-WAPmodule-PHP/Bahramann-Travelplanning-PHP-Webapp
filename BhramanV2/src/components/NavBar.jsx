import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/logo/red.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/feature/LoginSlice";
import { apiRoute } from "../utils/apiRoute";

export default function NavBar({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.LoginSlice.isLoggedIn);
  const user = useSelector((state) => state.LoginSlice.user);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setShowProfileDropdown(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(apiRoute.logout, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "action=logout",
      });

      const data = await response.json();

      if (data.success) {
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.clear();
        dispatch(logout());
        navigate("/login");
        setShowLogoutConfirm(false);
      } else {
        console.error("Logout failed:", data);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

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
          <div className="hidden md:block relative" ref={profileDropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon
                icon={faUser}
                className="text-mainRed p-2 bg-white shadow-md rounded-full shadow-black/50"
              />
              Profile
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-mainRed text-2xl"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50 rounded-md text-red-600 font-medium transition-colors"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <button
              className="button bg-mainRed p-2"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="button bg-mainRed p-2"
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
              className="button bg-mainRed p-2"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="button bg-mainRed p-2"
              onClick={() => navigate("/signup")}
            >
              Register
            </button>
          </div>)}
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Are you sure want to sign out?
              </h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={cancelLogout}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
