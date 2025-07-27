import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCheck } from "@fortawesome/free-solid-svg-icons";
import RateModal from "./RateModal.jsx";
import { apiRoute } from "../utils/apiRoute.js";

export default function BookingCard({
  id,
  image_path,
  title,
  description,
  total_rating,
  num_ratings,
  hotelOptions,
  vehicleOptions,
  isEditing = false,
  editBookingId = null,
  existingBookingData = null
}) {
  const [hotel, setHotel] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [date, setDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Auto-hide success popup after 3 seconds
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  // Populate form when editing
  useEffect(() => {
    if (isEditing && existingBookingData) {
      setVehicle(existingBookingData.vehicle_type || "");
      setNumberOfPeople(existingBookingData.number_of_people || 1);
      setDate(existingBookingData.booking_date || "");
      
      // Set hotel based on existing data - find matching hotel
      if (existingBookingData.hotel_name && hotelOptions.length > 0) {
        const matchingHotel = hotelOptions.find(hotel => 
          hotel.value.toLowerCase().includes(existingBookingData.hotel_name.toLowerCase())
        );
        if (matchingHotel) {
          setHotel(matchingHotel.value);
          setSelectedPrice(matchingHotel.price);
        }
      }
    }
  }, [isEditing, existingBookingData, hotelOptions]);

  const handleHotelChange = (e) => {
    const selectedHotel = e.target.value;
    setHotel(selectedHotel);
    const index = hotelOptions.findIndex(option => option.value === selectedHotel);
    setSelectedPrice(index !== -1 ? hotelOptions[index].price : "");
  };

  const handleSubmit = async () => {
    if (!hotel || !vehicle || !date || numberOfPeople < 1) {
      alert("Please fill all booking details.");
      return;
    }

    // Validate booking date (should be today or in future)
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      alert("Booking date must be today or in the future.");
      return;
    }

    const bookingData = {
      vehicle_type: vehicle,
      number_of_people: numberOfPeople,
      booking_date: date,
    };

    // Add location_id for new bookings, booking_id for updates
    if (isEditing) {
      bookingData.booking_id = editBookingId;
    } else {
      bookingData.location_id = id;
    }

    try {
      const response = await fetch(apiRoute.manageBookings, {
        method: isEditing ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(bookingData),
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setShowSuccessPopup(true);
        if (!isEditing) {
          // Reset form only for new bookings
          setHotel("");
          setVehicle("");
          setSelectedPrice("");
          setDate("");
          setNumberOfPeople(1);
        }
      } else {
        alert((isEditing ? "Update" : "Booking") + " failed: " + (result.error || result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error " + (isEditing ? "updating" : "creating") + " booking. Please try again.");
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
          Select start Date:
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded-md mb-2"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

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

        <div className="border border-gray-300 p-2 rounded-md flex items-center">
          <div className="w-1/2">
            Hotel: <span className="font-bold">{hotel}</span><br />
            Vehicle: <span className="font-bold">{vehicle}</span><br />
            Date: <span className="font-bold">{date}</span><br />
            People: <span className="font-bold">{numberOfPeople}</span>
          </div>
          <div className="w-1/2">
            Price: <span className="font-bold">{selectedPrice || 'N/A'}</span><br />
            Total: <span className="font-bold">
              {selectedPrice && numberOfPeople ? `Rs. ${(parseFloat(selectedPrice.replace(/[^\d.]/g, '')) * numberOfPeople).toLocaleString()}` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="w-full flex justify-end gap-4 mt-6">
          <button className="bg-mainRed hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-200" onClick={() => setIsRateModalOpen(true)}>
            Rate
          </button>
          <button className="bg-mainRed hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200" onClick={handleSubmit}>
            {isEditing ? 'Update Booking' : 'Confirm'}
          </button>
        </div>

        <RateModal isOpen={isRateModalOpen} setIsOpen={setIsRateModalOpen} onSubmit={submitRating} />
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-down">
            <FontAwesomeIcon icon={faCheck} className="text-xl" />
            <span className="font-semibold text-lg">
              {isEditing ? 'Booking has been updated.' : 'Hotel has been booked.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
