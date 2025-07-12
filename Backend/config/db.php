<?php
$host = 'localhost';
$dbname = 'bhramanv2';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Database connection error']);
    exit;
}
?>
