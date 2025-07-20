<?php
require_once '../../config/common_api.php';
require_once '../../config/db.php';

try {
    // Query the location table from your schema
    $sql = "SELECT location_id, location_name, total_rating, number_of_ratings, description, image_url, hotel_name, vehicle_type FROM location ORDER BY location_id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $locations = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $location = [
            'id' => $row['location_id'],
            'title' => $row['location_name'],
            'image_path' => $row['image_url'],
            'total_rating' => $row['total_rating'],
            'num_ratings' => $row['number_of_ratings'],
            'description' => $row['description'],
            'hotel_name' => $row['hotel_name'],
            'vehicle_type' => $row['vehicle_type']
        ];
        $locations[] = $location;
    }

    echo json_encode(['success' => true, 'data' => $locations]);

} catch (PDOException $e) {
    error_log('Get locations error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Failed to fetch locations']);
}
