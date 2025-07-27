
<?php
require_once '../../config/db.php';
require_once '../../config/common_api.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Support both JSON and form POST
        $location_id = 0;
        if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
            $input = json_decode(file_get_contents('php://input'), true);
            $location_id = intval($input['location_id'] ?? 0);
        } else {
            $location_id = intval($_POST['location_id'] ?? 0);
        }
        if (!$location_id) {
            echo json_encode(['success' => false, 'error' => 'Location ID is required.']);
            exit;
        }
        // Optionally, delete the image file from uploads (not required for basic delete)
        $stmt = $pdo->prepare('DELETE FROM location WHERE location_id = ?');
        $success = $stmt->execute([$location_id]);
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Location deleted successfully.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to delete location.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'An unexpected error occurred: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
