<?php
require_once '../../config/common_api.php';
require_once '../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['id']) || !is_numeric($input['id'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid booking ID.']);
    exit();
}

$bookingId = intval($input['id']);



try {
    $stmt = $pdo->prepare('DELETE FROM booking WHERE booking_id = ?');
    $stmt->execute([$bookingId]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Booking not found or already deleted.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
