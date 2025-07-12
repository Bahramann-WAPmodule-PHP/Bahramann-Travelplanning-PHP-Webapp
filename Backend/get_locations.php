<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB connection
$mysqli = new mysqli('localhost', 'root', '', 'bhraman');
if ($mysqli->connect_errno) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

// Use correct column names
$sql = "SELECT location_id, title, image_path, total_rating, num_ratings FROM locations ORDER BY location_id DESC";
$result = $mysqli->query($sql);

if (!$result) {
    echo json_encode(['success' => false, 'error' => 'Query failed']);
    exit;
}

$locations = [];
while ($row = $result->fetch_assoc()) {
    $row['id'] = $row['location_id']; // normalize field name for frontend
    unset($row['location_id']);
    $locations[] = $row;
}

echo json_encode(['success' => true, 'data' => $locations]);
