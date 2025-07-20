<?php
require '../../config/common_api.php';


// Wrap everything in try-catch to ensure JSON output
try { 
    require '../../config/db.php';

function getUserByEmail($pdo, $email) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function setRememberToken($pdo, $userId, $token) {
    $stmt = $pdo->prepare("UPDATE users SET remember_token = ? WHERE user_id = ?");
    $stmt->execute([$token, $userId]);
}

$post = $_POST;

// Login
if (isset($post['email'], $post['password'])) {
    $email = trim($post['email']);
    try {
        $user = getUserByEmail($pdo, $email);
        if (!$user) {
            echo json_encode(['success' => false, 'error' => 'email not found']);
            exit;
        }
        if (!password_verify($post['password'], $user['password'])) {
            echo json_encode(['success' => false, 'error' => 'password incorrect']);
            exit;
        }

        $_SESSION['user_id'] = $user['user_id'];

        if (isset($post['rememberMe']) && $post['rememberMe'] === '1') {
            $token = bin2hex(random_bytes(32));
            setRememberToken($pdo, $user['user_id'], $token);
            setcookie('remember_token', $token, time() + (86400 * 30), "/", "", false, true);
        } else {
            setRememberToken($pdo, $user['user_id'], null);
            setcookie('remember_token', '', time() - 3600, "/", "", false, true);
        }

        echo json_encode(['success' => true]);
        exit;
    } catch (PDOException $e) {
        error_log('Login Error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

// Session check (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if (isset($_SESSION['user_id'])) {
            echo json_encode(['isLoggedIn' => true]);
            exit;
        }

        // Try to login using remember token
        if (isset($_COOKIE['remember_token'])) {
            $token = $_COOKIE['remember_token'];
            $stmt = $pdo->prepare("SELECT * FROM users WHERE remember_token = ?");
            $stmt->execute([$token]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $_SESSION['user_id'] = $user['user_id'];
                echo json_encode(['isLoggedIn' => true]);
                exit;
            }
        }

        echo json_encode(['isLoggedIn' => false]);
        exit;
    } catch (PDOException $e) {
        error_log('Session Check Error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

// Invalid request
echo json_encode(['success' => false, 'error' => 'Invalid request']);
exit;

} catch (Exception $e) {
    // Log the error and return JSON
    error_log('Login Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Server error occurred']);
    exit;
}