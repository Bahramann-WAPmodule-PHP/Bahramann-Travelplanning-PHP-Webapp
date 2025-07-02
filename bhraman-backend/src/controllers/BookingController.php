<?php
// filepath: bhraman-backend/src/controllers/BookingController.php

namespace App\Controllers;

use App\Models\Booking;
use App\Utils\Response;

class BookingController {
    private $bookingModel;

    public function __construct() {
        $this->bookingModel = new Booking();
    }

    public function createBooking($data) {
        $result = $this->bookingModel->create($data);
        if ($result) {
            Response::send(201, "Booking created successfully", $result);
        } else {
            Response::send(400, "Failed to create booking");
        }
    }

    public function listBookings($userId) {
        $bookings = $this->bookingModel->getByUserId($userId);
        if ($bookings) {
            Response::send(200, "Bookings retrieved successfully", $bookings);
        } else {
            Response::send(404, "No bookings found");
        }
    }
}
