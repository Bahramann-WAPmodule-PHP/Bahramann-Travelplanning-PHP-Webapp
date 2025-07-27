import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/logo/red.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/feature/LoginSlice";
import { apiRoute } from "../utils/apiRoute";

export default function AdminNavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.LoginSlice.user);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

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

  const handleLogout = async () => {
    try {
      const response = await fetch(apiRoute.logout, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "action=logout",
      });
      const data = await response.json();
      if (data.success) {
        dispatch(logout());
        navigate("/login");
        setShowProfileDropdown(false);
      } else {
        console.error("Logout failed:", data);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="w-full h-[75px] flex items-center justify-between px-4 bg-white shadow-md relative">
      <img src={Logo} alt="Logo" className="h-[50px]" />
      <div className="flex items-center gap-4">
        <div className="relative" ref={profileDropdownRef}>
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
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50 rounded-md text-red-600 font-medium transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
