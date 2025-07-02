<?php
// filepath: bhraman-backend/src/controllers/AuthController.php

require '../utils/Response.php';
require '../models/User.php';
require '../utils/Database.php';
require_once '../utils/Cors.php';
Cors::enableCors();

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function signup($data) {
        // Validate input
        if(empty($data['first_name']) || empty($data['last_name']) || 
           empty($data['email']) || empty($data['password'])) {
            return [
                'success' => false,
                'message' => 'All fields are required'
            ];
        }

        // Check if email already exists
        $this->user->email = $data['email'];
        if($this->user->emailExists()) {
            return [
                'success' => false,
                'message' => 'Email already exists'
            ];
        }

        // Create user
        $this->user->first_name = $data['first_name'];
        $this->user->last_name = $data['last_name'];
        $this->user->email = $data['email'];
        $this->user->password = $data['password'];

        if($this->user->create()) {
            return [
                'success' => true,
                'message' => 'User created successfully'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Unable to create user'
            ];
        }
    }

    public function login($data) {
        // Validate input
        if(empty($data['email']) || empty($data['password'])) {
            return [
                'success' => false,
                'message' => 'Email and password are required'
            ];
        }

        $this->user->email = $data['email'];

        if($this->user->emailExists()) {
            if(password_verify($data['password'], $this->user->password)) {
                return [
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $this->user->id,
                        'first_name' => $this->user->first_name,
                        'last_name' => $this->user->last_name,
                        'email' => $this->user->email
                    ]
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Invalid password'
                ];
            }
        } else {
            return [
                'success' => false,
                'message' => 'User not found'
            ];
        }
    }
}
?>