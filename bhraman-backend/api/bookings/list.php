<?php
// bhraman-backend/api/bookings/list.php
require_once '../../src/utils/Cors.php';
Cors::enableCors();
// filepath: bhraman-backend/api/bookings/list.php
require_once '../../config/database.php';
require_once '../../src/models/Booking.php';
require_once '../../src/utils/Response.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$booking = new Booking($db);

$userId = $_GET['user_id'] ?? null; // Assuming user_id is passed as a query parameter

if ($userId) {
    $stmt = $booking->listBookings($userId);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($bookings) {
        Response::send(200, 'Bookings retrieved successfully', $bookings);
    } else {
        Response::send(404, 'No bookings found for this user');
    }
} else {
    Response::send(400, 'User ID is required');
}
?>