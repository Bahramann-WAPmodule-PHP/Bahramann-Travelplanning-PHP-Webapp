<?php
// Disable HTML error output to prevent JSON parsing issues
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);



//cors headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
header('Content-Type: application/json');
?>
