<?php
require_once '../../src/utils/Cors.php';
Cors::enableCors();

session_start();
require_once '../../config/database.php';
require_once '../../src/controllers/AuthController.php';

$database = new Database();
$db = $database->getConnection();

$authController = new AuthController($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = $authController->logout();
    echo json_encode($response);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method. Use POST to logout.'
    ]);
}
?>