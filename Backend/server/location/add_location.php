<?php
require_once '../../config/common_api.php';
require_once '../../config/db.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = null;

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debug log
    error_log('Add location request received');
    error_log('POST data: ' . print_r($_POST, true));
    error_log('FILES data: ' . print_r($_FILES, true));
    
    try {
        // Sanitize and validate input
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $hotel_names = trim($_POST['hotel_names'] ?? '');
        $hotel_prices = trim($_POST['hotel_prices'] ?? '');
        $vehicle_type = trim($_POST['vehicle_type'] ?? '');
        $initial_rating = intval($_POST['initial_rating'] ?? 5);

        // Validation
        if (empty($title) || empty($description) || empty($hotel_names) || empty($hotel_prices) || empty($vehicle_type)) {
            $response = ['success' => false, 'error' => 'Location name, description, hotel names, hotel prices, and vehicle types are required'];
        } elseif (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $response = ['success' => false, 'error' => 'Please upload a valid image'];
        } else {
            // Validate file size (max 5MB)
            if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
                $response = ['success' => false, 'error' => 'Image size should be less than 5MB'];
            } else {
                // Handle image upload
                $uploadDir = __DIR__ . '/../../uploads/';
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $imageTmpPath = $_FILES['image']['tmp_name'];
                $imageName = basename($_FILES['image']['name']);
                $imageExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

                if (!in_array($imageExtension, $allowedExtensions)) {
                    $response = ['success' => false, 'error' => 'Invalid image format. Please use JPG, PNG, GIF, or WebP'];
                } else {
                    $newImageName = uniqid('img_', true) . '.' . $imageExtension;
                    $imagePath = 'uploads/' . $newImageName;
                    $imageFullPath = $uploadDir . $newImageName;

                    if (!move_uploaded_file($imageTmpPath, $imageFullPath)) {
                        $response = ['success' => false, 'error' => 'Failed to save image. Please try again'];
                    } else {
                        // Test database connection and table structure
                        try {
                            $test_stmt = $pdo->prepare("DESCRIBE location");
                            $test_stmt->execute();
                            error_log('Location table structure exists');
                        } catch (PDOException $table_e) {
                            error_log('Location table error: ' . $table_e->getMessage());
                            $response = ['success' => false, 'error' => 'Database table issue: ' . $table_e->getMessage()];
                            echo json_encode($response);
                            exit;
                        }
                        
                        // Insert into database
                        $number_of_ratings = ($initial_rating > 0) ? 1 : 0;
                        $total_rating = $initial_rating;
                    
                        error_log('Attempting to insert location: ' . $title);
                        
                        $stmt = $pdo->prepare("INSERT INTO location (location_name, total_rating, number_of_ratings, description, hotel_names, hotel_prices, vehicle_type, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                        
                        $success = $stmt->execute([
                            $title,
                            $total_rating,
                            $number_of_ratings,
                            $description,
                            $hotel_names,
                            $hotel_prices,
                            $vehicle_type,
                            $imagePath
                        ]);
                        
                        if ($success) {
                            $location_id = $pdo->lastInsertId();
                            error_log('Location added successfully with ID: ' . $location_id);
                            $response = [
                                'success' => true, 
                                'message' => 'Location added successfully!',
                                'location_id' => $location_id,
                                'image_path' => $imagePath
                            ];
                        } else {
                            error_log('Failed to insert location into database');
                            $response = ['success' => false, 'error' => 'Failed to save location to database'];
                        }
                    }
                }
            }
        }
    } catch (PDOException $e) {
        error_log('Database error in add_location: ' . $e->getMessage());
        $response = ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    } catch (Exception $e) {
        error_log('General error in add_location: ' . $e->getMessage());
        $response = ['success' => false, 'error' => 'An unexpected error occurred: ' . $e->getMessage()];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

// Output response
if ($response) {
    echo json_encode($response);
} else {
    echo json_encode(['success' => false, 'error' => 'No response generated']);
}
?>
