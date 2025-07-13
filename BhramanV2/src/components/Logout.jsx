import React from "react";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../redux/feature/LoginSlice";
import { useNavigate } from "react-router-dom";
import { apiRoute } from "../utils/apiRoute";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      dispatch(setLoggedIn(false)); // Update Redux
      navigate("/login"); // Go to login page
    } else {
      console.error("Logout failed:", data);
    }
  } catch (err) {
    console.error("Logout error:", err);
  }
};

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded  mx-5"
    >
      Logout
    </button>
  );
}
