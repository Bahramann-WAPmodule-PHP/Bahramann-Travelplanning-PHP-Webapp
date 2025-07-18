<?php
header('Content-Type: application/json');

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid location id']);
    exit;
}

$id = intval($_GET['id']);

$mysqli = new mysqli('localhost', 'root', '', 'bhraman');
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

$stmt = $mysqli->prepare("SELECT * FROM locations WHERE location_id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();

$result = $stmt->get_result();
$location = $result->fetch_assoc();

if (!$location) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Location not found']);
    exit;
}

echo json_encode(['success' => true, 'data' => $location]);
