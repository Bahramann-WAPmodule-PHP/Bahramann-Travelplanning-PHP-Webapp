<?php
require_once '../../config/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $location_id = intval($input['location_id'] ?? 0);
    $rating = intval($input['rating'] ?? 0);

    if ($location_id <= 0 || $rating < 1 || $rating > 5) {
        echo json_encode(['success' => false, 'error' => 'Invalid location or rating']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE location SET total_rating = total_rating + ?, number_of_ratings = number_of_ratings + 1 WHERE id = ?");
        $success = $stmt->execute([$rating, $location_id]);

        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Rating submitted']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Database update failed']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'DB Error: ' . $e->getMessage()]);
    }
}
