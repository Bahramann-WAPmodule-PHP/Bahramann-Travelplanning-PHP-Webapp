<?php
// filepath: d:/bhraman-PHP-WebApp/samir/logout.php

session_start();
header('Content-Type: application/json');
require_once 'db.php';

$post = $_POST;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($post['action']) && $post['action'] === 'logout') {
    session_unset();
    session_destroy();

    if (isset($_COOKIE['remember_token'])) {
        $token = $_COOKIE['remember_token'];
        $stmt = $pdo->prepare("UPDATE users SET remember_token = NULL WHERE remember_token = ?");
        $stmt->execute([$token]);
    }

    setcookie('remember_token', '', time() - 3600, "/", "", false, true);

    echo json_encode(['success' => true]);
    exit;
}

// Invalid request
echo json_encode(['success' => false, 'error' => 'Invalid request']);
exit;
