import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { apiRoute } from "../utils/apiRoute";
import RateModal from "./RateModal.jsx";

export default function BookingCard({
  id,
  image_path,
  title,
  description,
  total_rating,
  num_ratings,
  hotelOptions,
  vehicleOptions,
}) {
  const [hotel, setHotel] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [date, setDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  const isLoggedIn = useSelector((state) => state.LoginSlice.isLoggedIn);

  const handleHotelChange = (e) => {
    const selectedHotel = e.target.value;
    setHotel(selectedHotel);
    const index = hotelOptions.findIndex(option => option.value === selectedHotel);
    setSelectedPrice(index !== -1 ? hotelOptions[index].price : "");
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert("Please log in to make a booking.");
      return;
    }

    if (!hotel || !vehicle || !date || numberOfPeople < 1) {
      alert("Please fill all booking details.");
      return;
    }

    // Validate booking date (should be today or in future)
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      alert("Booking date cannot be in the past.");
      return;
    }

    setIsBooking(true);

    const bookingData = {
      location_id: id,
      vehicle_type: vehicle,
      number_of_people: numberOfPeople,
      booking_date: date,
    };

    try {
      const response = await fetch(apiRoute.manageBookings, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
        credentials: "include",
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Booking created successfully!");
        // Reset form
        setHotel("");
        setVehicle("");
        setSelectedPrice("");
        setDate("");
        setNumberOfPeople(1);
      } else {
        alert("Booking failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const submitRating = async (rating) => {
    try {
      const res = await fetch("http://localhost/Bhramanapp/Backend/server/location/add_rating.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location_id: id, rating }),
      });

      const result = await res.json();
      alert(result.success ? "Thank you for rating!" : "Rating failed: " + result.error);
    } catch (err) {
      alert("Error submitting rating");
      console.error(err);
    }
  };

  const renderStars = (top, bottom, size) => {
    if (bottom === 0) return <p>No rating yet</p>;
    const avg = Math.floor(top / bottom);
    return Array.from({ length: avg }).map((_, i) => (
      <FontAwesomeIcon key={i} icon={faStar} className="text-mainYellow" style={{ fontSize: size }} />
    ));
  };

  return (
    <div className="w-9/10 bg-white shadow-lg rounded-lg p-4 h-7/10 flex flex-col sm:flex-row gap-5">
      <img
        src={`/api/bhramanapp/backend/${image_path}`}
        alt={title}
        className="w-full sm:w-6/10 h-full rounded-2xl object-cover"
      />
      <div className="w-full sm:w-4/10">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {renderStars(total_rating, num_ratings, "1.5rem")}
          <span className="text-darkBlue font-bold text-2xl">{num_ratings} Reviews</span>
        </div>
        <p className="text-gray-500 mt-2 text-justify">{description}</p>

        <select className="w-full border border-gray-300 p-2 rounded-md mb-2" value={hotel} onChange={handleHotelChange}>
          <option value="">Choose Hotel</option>
          {hotelOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.value} - {opt.price}</option>
          ))}
        </select>

        <select className="w-full border border-gray-300 p-2 rounded-md mb-2" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
          <option value="">Choose Vehicle</option>
          {vehicleOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.value}</option>
          ))}
        </select>

        <label>
          Number of People:
          <input
            type="number"
            min="1"
            max="20"
            className="w-full border border-gray-300 p-2 rounded-md mb-2"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
          />
        </label>

        <label>
          Select Booking Date:
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded-md mb-2"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div className="border border-gray-300 p-2 rounded-md flex items-center">
          <div className="w-1/2">
            Hotel: <span className="font-bold">{hotel}</span><br />
            Vehicle: <span className="font-bold">{vehicle}</span><br />
            People: <span className="font-bold">{numberOfPeople}</span><br />
            Date: <span className="font-bold">{date}</span>
          </div>
          <div className="w-1/2">
            Price: <span className="font-bold">{selectedPrice || 'N/A'}</span><br />
            Total: <span className="font-bold">
              {selectedPrice && numberOfPeople ? `Rs. ${(parseFloat(selectedPrice) * numberOfPeople).toLocaleString()}` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="w-full flex justify-end gap-2">
          <button className="button bg-mainRed mt-2 text-2xl" onClick={() => setIsRateModalOpen(true)}>Rate</button>
          <button 
            className="button bg-mainRed mt-2 text-2xl disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleSubmit}
            disabled={isBooking || !isLoggedIn}
          >
            {isBooking ? 'Booking...' : 'Confirm'}
          </button>
        </div>

        <RateModal isOpen={isRateModalOpen} setIsOpen={setIsRateModalOpen} onSubmit={submitRating} />
      </div>
    </div>
  );
}
