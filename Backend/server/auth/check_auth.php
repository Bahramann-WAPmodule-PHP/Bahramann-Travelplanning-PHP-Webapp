<?php
require '../../config/db.php';

#Set headers for CORS and JSON responses
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json');

#Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

#Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
#check user login status
$isLoggedIn = isset($_SESSION['user_id']) && isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'];
$userData = null;


if (!$isLoggedIn && isset($_COOKIE['remember_me'])) {
    list($selector, $validator) = explode(':', $_COOKIE['remember_me']);
    
    try {
        #Get token from database
        $stmt = $conn->prepare("
            SELECT user_id, username, email 
            FROM users 
            WHERE session_token LIKE ? 
            AND session_expiry > NOW()
        ");
        $stmt->execute([$selector . ':%']);
        $user = $stmt->fetch();
        
        if ($user) {
            #Extract token parts
            $token = $conn->query("SELECT session_token FROM users WHERE user_id = " . $user['user_id'])->fetchColumn();
            list($dbSelector, $dbHash) = explode(':', $token);
            
            #Verify token
            if (hash_equals($dbHash, hash('sha256', $validator))) {
                
                #Auto-login the user
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['is_logged_in'] = true;
                
                $isLoggedIn = true;
                $userData = [
                    'id' => $user['user_id'],
                    'name' => $user['first_name'] . ' ' . $user['last_name'],
                    'email' => $user['email']
                ];
                
                #Refresh the remember me token
                $newValidator = bin2hex(random_bytes(32));
                $hashedValidator = hash('sha256', $newValidator);
                $expires = date('Y-m-d H:i:s', time() + 30 * 24 * 60 * 60); // 30 days
                
                $stmt = $conn->prepare("UPDATE users SET remember_token = ?, remember_expiry = ? WHERE user_id = ?");
                $stmt->execute([$selector . ':' . $hashedValidator, $expires, $user['user_id']]);
                
                setcookie(
                    'remember_me',
                    $selector . ':' . $newValidator,
                    time() + 30 * 24 * 60 * 60, 
                    '/',
                    '',
                    isset($_SERVER['HTTPS']),
                    true
                );
            }
        }
    } catch (PDOException $e) {
        error_log("Remember me check error: " . $e->getMessage());
    }
}

# If logged in and we don't have user data yet
if ($isLoggedIn && $userData === null && isset($_SESSION['user_id'])) {
    try {
        $stmt = $conn->prepare("
            SELECT user_id, first_name, last_name, email 
            FROM users 
            WHERE user_id = ?
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if ($user) {
            $userData = [
                'id' => $user['user_id'],
                'name' => $user['first_name'] . ' ' . $user['last_name'],
                'email' => $user['email']
            ];
        }
    } catch (PDOException $e) {
        error_log("Session check error: " . $e->getMessage());
    }
}

#Return authentication status
$response = [
    'isLoggedIn' => $isLoggedIn
];

if ($isLoggedIn && $userData !== null) {
    $response['user'] = $userData;
}

echo json_encode($response);
?>
