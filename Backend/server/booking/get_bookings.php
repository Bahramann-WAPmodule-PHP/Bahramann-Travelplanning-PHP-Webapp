<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db.php';

try {
    // Join booking table with users and location tables to get names instead of IDs
    $sql = "SELECT 
                b.booking_id,
                b.user_id,
                u.username,
                b.location_id,
                l.location_name,
                b.vehicle_type,
                b.number_of_people,
                b.booking_date
            FROM booking b
            LEFT JOIN users u ON b.user_id = u.user_id
            LEFT JOIN location l ON b.location_id = l.location_id
            ORDER BY b.booking_date DESC";
    
    $stmt = $pdo->query($sql);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'bookings' => $bookings]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
