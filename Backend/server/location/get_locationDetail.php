<?php
// Include common API setup and database connection
require_once '../../config/common_api.php';
require_once '../../config/db.php';

try {
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing or invalid location id']);
        exit;
    }

    $id = intval($_GET['id']);

    // Query the location table from your schema
    $stmt = $pdo->prepare("SELECT location_id, location_name, total_rating, number_of_ratings, description, image_url, hotel_names, hotel_prices, vehicle_type FROM location WHERE location_id = ?");
    $stmt->execute([$id]);
    
    $location = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$location) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Location not found']);
        exit;
    }

    // Normalize field names for frontend
    $response = [
        'id' => $location['location_id'],
        'title' => $location['location_name'],
        'image_path' => $location['image_url'],
        'total_rating' => $location['total_rating'],
        'num_ratings' => $location['number_of_ratings'],
        'description' => $location['description'],
        'hotel_names' => $location['hotel_names'],
        'hotel_prices' => $location['hotel_prices'],
        'vehicle_type' => $location['vehicle_type']
    ];

    echo json_encode(['success' => true, 'data' => $response]);

} catch (PDOException $e) {
    error_log('Get location detail error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch location details']);
}
?>
