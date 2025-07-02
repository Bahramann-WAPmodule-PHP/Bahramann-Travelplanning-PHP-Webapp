<?php
// filepath: bhraman-backend/src/middleware/AuthMiddleware.php

class AuthMiddleware {
    public static function checkAuth() {
        // Check if the user is authenticated
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            exit();
        }
    }
}
