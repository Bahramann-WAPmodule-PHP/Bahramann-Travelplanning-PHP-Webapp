<?php
require 'config/common_api.php';
require 'config/db.php';

try {
    // Check what image URLs are stored in the location table
    $stmt = $pdo->query("SELECT location_id, location_name, image_url FROM location LIMIT 5");
    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Also check a sample booking if any exist
    $bookingStmt = $pdo->query("
        SELECT b.booking_id, l.location_name, l.image_url 
        FROM booking b 
        JOIN location l ON b.location_id = l.location_id 
        LIMIT 3
    ");
    $bookings = $bookingStmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Debug image data',
        'locations' => $locations,
        'bookings' => $bookings,
        'uploads_exist' => file_exists('uploads/'),
        'sample_files' => array_slice(scandir('uploads/'), 2, 5) // Skip . and ..
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
