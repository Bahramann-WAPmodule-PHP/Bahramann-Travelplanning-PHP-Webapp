<?php
// CORS headers - must be at the very top
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Content-Type: application/json');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db.php';
require_once '../../config/common_api.php';

try {
    // Corrected: Using `comments` table instead of `comment`
    $stmt = $pdo->query("
        SELECT 
            l.location_id, 
            l.location_name, 
            l.total_rating, 
            l.number_of_ratings, 
            l.image_url,
            COUNT(DISTINCT c.comment) AS total_comments,
            COUNT(DISTINCT b.booking_id) AS total_bookings
        FROM location l
        LEFT JOIN comments c ON l.location_id = c.location_id
        LEFT JOIN booking b ON l.location_id = b.location_id
        GROUP BY l.location_id, l.location_name, l.total_rating, l.number_of_ratings, l.image_url
        ORDER BY total_bookings DESC
        LIMIT 3
    ");

    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $locations]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
