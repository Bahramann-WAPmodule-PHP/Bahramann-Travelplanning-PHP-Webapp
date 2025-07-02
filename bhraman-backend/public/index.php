<?php
require_once '../src/utils/Cors.php';
Cors::enableCors();

require_once '../config/config.php';
require_once '../config/database.php';

// Autoload classes
spl_autoload_register(function ($class_name) {
    include '../src/' . str_replace('\\', '/', $class_name) . '.php';
});

// Handle API requests
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

switch ($requestUri) {
    case '/api/auth/login':
        require_once '../api/auth/login.php';
        break;
    case '/api/auth/signup':
        require_once '../api/auth/signup.php';
        break;
    case '/api/auth/logout':
        require_once '../api/auth/logout.php';
        break;
    case '/api/destinations':
        require_once '../api/destinations/index.php';
        break;
    case '/api/destinations/details':
        require_once '../api/destinations/details.php';
        break;
    case '/api/bookings/create':
        require_once '../api/bookings/create.php';
        break;
    case '/api/bookings/list':
        require_once '../api/bookings/list.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['message' => 'Not Found']);
        break;
}
?>