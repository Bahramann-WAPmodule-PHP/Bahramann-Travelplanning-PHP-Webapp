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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['location_id'], $data['name'], $data['comment'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO comments (location_id, name, comment) VALUES (?, ?, ?)");
    $stmt->execute([$data['location_id'], $data['name'], $data['comment']]);

    echo json_encode([
        'success' => true,
        'data' => [
            'name' => $data['name'],
            'comment' => $data['comment'],
            'likes' => 0,
            'dislikes' => 0
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
