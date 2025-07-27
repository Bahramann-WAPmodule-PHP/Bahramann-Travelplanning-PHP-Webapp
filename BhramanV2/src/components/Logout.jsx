import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/feature/LoginSlice";
import { useNavigate } from "react-router-dom";
import { apiRoute } from "../utils/apiRoute";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

const handleLogoutClick = () => {
  setShowLogoutConfirm(true);
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
    <>
      <button
        onClick={handleLogoutClick}
        className="bg-red-500 text-white px-4 py-2 rounded mx-5"
      >
        Logout
      </button>

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
    </>
  );
}
