<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
session_start();

#If it's not a POST request, return error
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}


require '../../config/db.php';

#sanitized data
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$password = $_POST['password'] ?? '';
$rememberMe = isset($_POST['rememberMe']) && $_POST['rememberMe'] === '1';

#input validations
$errors = [];

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Valid email address is required';
}

if (empty($password)) {
    $errors['password'] = 'Password is required';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    # Get the user by email
    $stmt = $conn->prepare('SELECT user_id, username, email, password FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();


    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['is_logged_in'] = true;
        
        # If remember me is checked, create a persistent token
        if ($rememberMe) {
            // Generate a secure token
            $selector = bin2hex(random_bytes(16));
            $validator = bin2hex(random_bytes(32));
            $token = $selector . ':' . hash('sha256', $validator);
            $expiry = date('Y-m-d H:i:s', strtotime('+30 days'));
            
            // Store the token in the database
            $stmt = $conn->prepare('UPDATE users SET session_token = ?, session_expiry = ? WHERE user_id = ?');
            $stmt->execute([$token, $expiry, $user['user_id']]);
            
            // Set a cookie with the token
            setcookie('remember_me', $selector . ':' . $validator, time() + (30 * 24 * 60 * 60), '/', '', false, true);
        }

        #return response
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['user_id'],
                'username' => $user['username'],
                'email' => $user['email']
            ]
        ]);
    } else {
        # Invalid credentials response
        echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
    }
} catch (PDOException $e) {
    error_log('Login Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'An error occurred during login']);
}
