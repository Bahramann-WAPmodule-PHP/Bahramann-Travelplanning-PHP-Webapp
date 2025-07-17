import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
export default function BookingCard({
  scene,
  location,
  numerator,
  denominator,
  reviews,
  Description,
  hotelOptions,
}) {
  const [hotel, setHotel] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [date, setDate] = React.useState("");
const vehicleOptions = [
  { value: "bolero" },
  { value: "hlace" },
  { value: "sumo" },
  { value: "winger" },
  { value: "kinglong" },
  { value: "lotus" }
];

  // You can then use this array to populate a dropdown menu
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
    <div className="w-9/10 bg-white shadow-lg rounded-lg p-4 h-7/10 flex gap-5">
      <img src={scene} alt={location} className="w-6/10 rounded-2xl" />
      <div className="relative">
        <h1 className="text-4xl font-bold">{location}</h1>
        <div>
          {renderStars(numerator, denominator, "1.5rem")}{" "}
          <span className="text-darkBlue font-bold text-2xl">
            {reviews} Reviews
          </span>
        </div>
        <p className="text-gray-500 mt-2 text-justify">{Description}</p>
        <select
          name=""
          id=""
          className="w-full border border-gray-300 p-2 rounded-md mb-2"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
        >
          <option value="">Select Vehicle</option>
          {vehicleOptions.map((option) => (
            <option value={option.value}>{option.value}</option>
          ))}
        </select>
        <select
          name=""
          id=""
          className="w-full border border-gray-300 p-2 rounded-md  mb-2"
          value={hotel}
          onChange={(e) => setHotel(e.target.value)}
        >
          <option value="">Choose Hotel</option>
          {hotelOptions.map((option) => (
            <option value={option.value}>{option.value}</option>
          ))}
        </select>
        <label>
          Select start Date:
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded-md  mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <div className="border border-gray-300 p-2 rounded-md flex items-center">
          <div className="w-1/2">
            Vehicle: <span className="font-bold">{vehicle} </span>
            <br />
            Hotel: <span className="font-bold">{hotel}</span> <br />
          </div>
          <div className="w-1/2">
            Price: <span className="font-bold"></span><br />
            date: <span className="font-bold">{date}</span>
          </div>
        </div>
        <button className="button bg-mainRed absolute bottom-1 right-1 text-2xl">Confirm</button>
      </div>
    </div>
  );
}
