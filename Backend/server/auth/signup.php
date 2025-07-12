<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

#If it's not a POST request, return error
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

require '../../config/db.php';

#sanitize data and get user data
$firstName = filter_input(INPUT_POST, 'firstName', FILTER_SANITIZE_STRING);
$lastName = filter_input(INPUT_POST, 'lastName', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'emailAddress', FILTER_SANITIZE_EMAIL);
$password = $_POST['password'] ?? ''; // We'll hash this, not sanitize

#Validate inputs
$errors = [];

if (empty($firstName)) {
    $errors['firstName'] = 'First name is required';
}

if (empty($lastName)) {
    $errors['lastName'] = 'Last name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['emailAddress'] = 'Valid email address is required';
}

if (empty($password) || strlen($password) < 6) {
    $errors['password'] = 'Password must be at least 6 characters';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    #Check if user already exists
    $stmt = $conn->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $userExists = (bool) $stmt->fetchColumn();

    if ($userExists) {
        echo json_encode(['success' => false, 'errors' => ['emailAddress' => 'User with this email already exists']]);
        exit;
    }

    #Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    #Insert the new user
    $stmt = $conn->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    $username = $firstName . ' ' . $lastName; // Combine for username
    $stmt->execute([$username, $email, $hashedPassword]);

    #Return success response
    echo json_encode([
        'success' => true, 
        'message' => 'Registration successful!'
    ]);
    
} catch (PDOException $e) {
    error_log('Signup Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'An error occurred during registration']);
}
