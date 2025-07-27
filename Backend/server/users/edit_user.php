
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['id']) || !is_numeric($input['id'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid user ID.']);
    exit();
}

$id = intval($input['id']);
$first_name = isset($input['first_name']) ? trim($input['first_name']) : '';
$last_name = isset($input['last_name']) ? trim($input['last_name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$is_admin = isset($input['is_admin']) && $input['is_admin'] ? 1 : 0;

if ($first_name === '' || $last_name === '' || $email === '') {
    echo json_encode(['success' => false, 'error' => 'All fields are required.']);
    exit();
}

$username = $first_name . ' ' . $last_name;

require_once '../../config/db.php';

try {
    $stmt = $pdo->prepare('UPDATE users SET username = ?, email = ?, is_admin = ? WHERE user_id = ?');
    $stmt->execute([$username, $email, $is_admin, $id]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No changes made or user not found.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
