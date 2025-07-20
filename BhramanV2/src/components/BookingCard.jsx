import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

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
  const [hotel, setHotel] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [selectedPrice, setSelectedPrice] = React.useState("");
  const [date, setDate] = React.useState("");

  const handleHotelChange = (e) => {
    const selectedHotel = e.target.value;
    setHotel(selectedHotel);
    
    // Find the corresponding price for the selected hotel
    const hotelIndex = hotelOptions.findIndex(option => option.value === selectedHotel);
    if (hotelIndex !== -1 && hotelOptions[hotelIndex].price) {
      setSelectedPrice(hotelOptions[hotelIndex].price);
    } else {
      setSelectedPrice("");
    }
  };

  const handleSubmit = async () => {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    if (!hotel) {
      alert("Please select a hotel");
      return;
    }

    if (!vehicle) {
      alert("Please select a vehicle");
      return;
    }

    if (!date) {
      alert("Please select a date");
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

    console.log("BookingData:", bookingData);

    try {
      const response = await fetch("http://localhost/Bhramanapp/Backend/server/booking/create_booking.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
        credentials: "include",
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        alert("Booking created successfully!");
      } else {
        alert("Failed to create booking: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating booking");
    }
  };

  const renderStars = (top, bottom, size) => {
    if (bottom === 0) {
      return <p>No rating till now</p>;
    }

    const averageRating = Math.floor(top / bottom);
    const stars = [];
    for (let i = 0; i < averageRating; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className="text-mainYellow"
          style={{ fontSize: size }}
        />
      );
    }
    return stars;
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
        <div>
          {renderStars(total_rating, num_ratings, "1.5rem")}{" "}
          <span className="text-darkBlue font-bold text-2xl">
            {num_ratings} Reviews
          </span>
        </div>
        <p className="text-gray-500 mt-2 text-justify">{description}</p>

        <select
          className="w-full border border-gray-300 p-2 rounded-md mb-2"
          value={hotel}
          onChange={handleHotelChange}
        >
          <option value="">Choose Hotel</option>
          {hotelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value} - {option.price}
            </option>
          ))}
        </select>

        <select
          className="w-full border border-gray-300 p-2 rounded-md mb-2"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
        >
          <option value="">Choose Vehicle</option>
          {vehicleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
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
            Hotel: <span className="font-bold">{hotel}</span>
            <br />
            Vehicle: <span className="font-bold">{vehicle}</span>
            <br />
            Date: <span className="font-bold">{date}</span>
          </div>
          <div className="w-1/2">
            Price: <span className="font-bold">{selectedPrice || 'N/A'}</span>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button 
            className="button bg-mainRed mt-2 text-2xl"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
