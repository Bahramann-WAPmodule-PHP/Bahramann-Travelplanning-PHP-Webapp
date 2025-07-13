<?php
// filepath: d:/bhraman-PHP-WebApp/samir/signup.php

session_start();
header('Content-Type: application/json');
require_once 'db.php';

function getUserByEmail($pdo, $email) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function createUser($pdo, $firstName, $lastName, $email, $password) {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)");
    return $stmt->execute([$firstName, $lastName, $email, $hash]);
}

$post = $_POST;

if (isset($post['firstName'], $post['lastName'], $post['emailAddress'], $post['password'])) {
    $email = trim($post['emailAddress']);
    if (getUserByEmail($pdo, $email)) {
        echo json_encode(['success' => false, 'error' => 'User already exists with this email']);
        exit;
    }
    if (createUser($pdo, $post['firstName'], $post['lastName'], $email, $post['password'])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Signup failed']);
    }
    exit;
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit;
}
