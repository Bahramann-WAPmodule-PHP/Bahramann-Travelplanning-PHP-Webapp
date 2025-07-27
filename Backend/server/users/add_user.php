<?php
require_once '../../config/common_api.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

$first_name = trim($data['first_name'] ?? '');
$last_name = trim($data['last_name'] ?? '');
$username = trim($first_name . ' ' . $last_name);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$is_admin = !empty($data['is_admin']) ? 1 : 0;

if (!$first_name || !$last_name || !$email || !$password) {
    echo json_encode(['success' => false, 'error' => 'All fields are required.']);
    exit();
}

// Check if email already exists
$stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetchColumn() > 0) {
    echo json_encode(['success' => false, 'error' => 'Email already exists.']);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)');
    $stmt->execute([$username, $email, $hashedPassword, $is_admin]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    error_log('Add user error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Failed to add user.']);
}
