<?php
require_once '../../config/common_api.php';
require_once '../../config/db.php';
try {
    

    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'User not logged in']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        $location_id = intval($input['location_id'] ?? 0);
        $rating = intval($input['rating'] ?? 0);

        if ($location_id <= 0 || $rating < 1 || $rating > 5) {
            echo json_encode(['success' => false, 'error' => 'Invalid location or rating']);
            exit;
        }

        // Check if location exists
        $checkStmt = $pdo->prepare("SELECT location_id FROM location WHERE location_id = ?");
        $checkStmt->execute([$location_id]);
        
        if ($checkStmt->rowCount() === 0) {
            echo json_encode(['success' => false, 'error' => 'Location not found']);
            exit;
        }

        // Update the location rating
        $stmt = $pdo->prepare("UPDATE location SET total_rating = total_rating + ?, number_of_ratings = number_of_ratings + 1 WHERE location_id = ?");
        $success = $stmt->execute([$rating, $location_id]);

        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Rating submitted successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Database update failed']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    }

} catch (PDOException $e) {
    error_log('Rating Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('Rating Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>
