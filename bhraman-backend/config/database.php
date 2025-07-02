<?php
// filepath: bhraman-backend/config/database.php
$host= 'localhost';
$db = 'bhraman_travel';
$username = 'root';
$password = ''; // Default for XAMPP is empty, change if necessary
// Database connection settings


try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>