<?php
require_once '../../src/utils/Cors.php';
Cors::enableCors();
// filepath: bhraman-backend/api/bookings/create.php

require_once '../../config/database.php';
require_once '../../src/models/Booking.php';
require_once '../../src/utils/Response.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$booking = new Booking($db);

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->destination_id) && isset($data->date) && isset($data->people)) {
    $booking->user_id = $data->user_id;
    $booking->destination_id = $data->destination_id;
    $booking->date = $data->date;
    $booking->people = $data->people;

    if ($booking->create()) {
        Response::send(201, "Booking created successfully.");
    } else {
        Response::send(500, "Unable to create booking.");
    }
} else {
    Response::send(400, "Invalid input.");
}
?>