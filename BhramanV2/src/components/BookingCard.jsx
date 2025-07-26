import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  const handleHotelChange = (e) => {
    const selectedHotel = e.target.value;
    setHotel(selectedHotel);
    const index = hotelOptions.findIndex(option => option.value === selectedHotel);
    setSelectedPrice(index !== -1 ? hotelOptions[index].price : "");
  };

  const handleSubmit = async () => {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    if (!hotel || !vehicle || !date) {
      alert("Please fill all booking details.");
      return;
    }

    const bookingData = {
      location_id: id,
      hotel_name: hotel,
      hotel_price: selectedPrice,
      vehicle_type: vehicle,
      start_date: date,
      end_date: endDate.toISOString().split("T")[0],
    };

    try {
      const response = await fetch("http://localhost/Bhramanapp/Backend/server/booking/create_booking.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
        credentials: "include",
      });

      const result = await response.json();
      alert(result.success ? "Booking created successfully!" : "Booking failed: " + result.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating booking");
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
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div className="border border-gray-300 p-2 rounded-md flex items-center">
          <div className="w-1/2">
            Hotel: <span className="font-bold">{hotel}</span><br />
            Vehicle: <span className="font-bold">{vehicle}</span><br />
            Date: <span className="font-bold">{date}</span>
          </div>
          <div className="w-1/2">
            Price: <span className="font-bold">{selectedPrice || 'N/A'}</span>
          </div>
        </div>

        <div className="w-full flex justify-end gap-2">
          <button className="button bg-mainRed mt-2 text-2xl" onClick={() => setIsRateModalOpen(true)}>Rate</button>
          <button className="button bg-mainRed mt-2 text-2xl" onClick={handleSubmit}>Confirm</button>
        </div>

        <RateModal isOpen={isRateModalOpen} setIsOpen={setIsRateModalOpen} onSubmit={submitRating} />
      </div>
    </div>
  );
}
