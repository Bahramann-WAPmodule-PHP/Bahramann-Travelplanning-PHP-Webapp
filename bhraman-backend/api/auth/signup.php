<?php

require '../../src/utils/Cors.php';
require '../../src/utils/Database.php';
require '../../src/models/User.php';
require '../../src/controllers/AuthController.php';
require '../../utils/Response.php';
Cors::enableCors();

$database = new Database();
$db = $database->getConnection();
$authController = new AuthController($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $result = $authController->signup($data);
    
    http_response_code($result['success'] ? 201 : 400);
    echo json_encode($result);
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>