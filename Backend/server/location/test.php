<?php
require_once '../../config/common_api.php';

echo json_encode([
    'success' => true,
    'message' => 'Backend is working!',
    'timestamp' => date('Y-m-d H:i:s'),
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'post_data' => $_POST,
    'files_data' => $_FILES
]);
?>
