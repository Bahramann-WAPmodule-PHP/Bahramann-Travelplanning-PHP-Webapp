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

require_once '../../config/common_api.php';
require_once '../../config/db.php';

$location_id = $_GET['location_id'] ?? null;

if (!$location_id || !is_numeric($location_id)) {
    echo json_encode(['success' => false, 'error' => 'Invalid location ID']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT name, comment, likes, dislikes FROM comments WHERE location_id = ? ORDER BY id DESC");
    $stmt->execute([$location_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $comments]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
