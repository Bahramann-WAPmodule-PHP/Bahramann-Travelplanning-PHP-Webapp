
<?php
require_once '../../config/db.php';
require_once '../../config/common_api.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT user_id AS id, username, email, is_admin, remember_token, session_token, session_expiry, created_at FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'users' => $users]);
} catch (PDOException $e) {
    error_log('Get users error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch users']);
}
