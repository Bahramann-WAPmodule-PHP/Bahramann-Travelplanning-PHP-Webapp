<?php
// filepath: d:\bhraman-PHP-WebApp\samir\main.php
session_start();
header('Content-Type: application/json');

$mysqli = new mysqli('localhost', 'root', '', 'bhraman');
if ($mysqli->connect_errno) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

function getUserByEmail($mysqli, $email) {
    $stmt = $mysqli->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function createUser($mysqli, $firstName, $lastName, $email, $password) {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $mysqli->prepare("INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('ssss', $firstName, $lastName, $email, $hash);
    return $stmt->execute();
}

function setRememberToken($mysqli, $userId, $token) {
    $stmt = $mysqli->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
    $stmt->bind_param('si', $token, $userId);
    $stmt->execute();
}

$post = $_POST;

// Signup
if (isset($post['firstName'], $post['lastName'], $post['emailAddress'], $post['password'])) {
    $email = trim($post['emailAddress']);
    if (getUserByEmail($mysqli, $email)) {
        echo json_encode(['success' => false, 'error' => 'User already exists with this email']);
        exit;
    }
    if (createUser($mysqli, $post['firstName'], $post['lastName'], $email, $post['password'])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Signup failed']);
    }
    exit;
}

// Login
if (isset($post['email'], $post['password'])) {
    $email = trim($post['email']);
    $user = getUserByEmail($mysqli, $email);
    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'email not found']);
        exit;
    }
    if (!password_verify($post['password'], $user['password_hash'])) {
        echo json_encode(['success' => false, 'error' => 'password incorrect']);
        exit;
    }

    $_SESSION['user_id'] = $user['id'];

    // Remember Me
    if (isset($post['rememberMe']) && $post['rememberMe'] === '1') {
        $token = bin2hex(random_bytes(32));
        setRememberToken($mysqli, $user['id'], $token);
        setcookie('remember_token', $token, time() + (86400 * 30), "/", "", false, true);
    } else {
        setRememberToken($mysqli, $user['id'], null);
        setcookie('remember_token', '', time() - 3600, "/", "", false, true);
    }

    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Invalid request']);
exit;