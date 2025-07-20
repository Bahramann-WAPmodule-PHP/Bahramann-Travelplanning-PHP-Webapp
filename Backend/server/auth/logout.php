<?php
require '../../config/common_api.php';

// Wrap everything in try-catch to ensure JSON output
try {
    require '../../db.php';

    $post = $_POST;

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($post['action']) && $post['action'] === 'logout') {
        session_unset();
        session_destroy();

        // Only clear remember_token if the column exists
        if (isset($_COOKIE['remember_token'])) {
            try {
                $token = $_COOKIE['remember_token'];
                $stmt = $pdo->prepare("UPDATE users SET remember_token = NULL WHERE remember_token = ?");
                $stmt->execute([$token]);
            } catch (PDOException $e) {
                // If remember_token column doesn't exist, just log the error but continue
                error_log('Remember token column not found: ' . $e->getMessage());
            }
        }

        setcookie('remember_token', '', time() - 3600, "/", "", false, true);

        echo json_encode(['success' => true]);
        exit;
    }

    // Invalid request
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit;

} catch (Exception $e) {
    // Log the error and return JSON
    error_log('Logout Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Server error occurred']);
    exit;
}
