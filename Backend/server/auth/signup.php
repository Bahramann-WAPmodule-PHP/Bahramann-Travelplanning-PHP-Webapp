<?php
require '../../config/common_api.php';
// Wrap everything in try-catch to ensure JSON output
try {
    require_once '../../config/db.php';

    function getUserByEmail($pdo, $email) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    function createUser($pdo, $firstName, $lastName, $email, $password) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $username = $firstName . ' ' . $lastName; // Combine first and last name
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        return $stmt->execute([$username, $email, $hash]);
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
    
} catch (Exception $e) {
    // Log the error and return JSON
    error_log('Signup Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Server error occurred']);
    exit;
}