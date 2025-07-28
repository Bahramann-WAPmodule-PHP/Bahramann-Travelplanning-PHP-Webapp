<?php
require_once '../../config/common_api.php';
require_once '../../config/db.php';

session_start();

$response = null;


// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $hotel_names = trim($_POST['hotel_names'] ?? '');
        $hotel_prices = trim($_POST['hotel_prices'] ?? '');
        $vehicle_type = trim($_POST['vehicle_type'] ?? '');
        $initial_rating = intval($_POST['initial_rating'] ?? 0);

        // Validation
        if (empty($title) || empty($description) || empty($hotel_names) || empty($hotel_prices) || empty($vehicle_type)) {
            $response = ['success' => false, 'error' => 'Location name, description, hotel names, hotel prices, and vehicle types are required'];
        } elseif (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $response = ['success' => false, 'error' => 'Please upload a valid image'];
        } else {
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
                    $number_of_ratings = ($initial_rating > 0) ? 1 : 0;
                    $total_rating = $initial_rating;
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
                        $response = [
                            'success' => true,
                            'message' => 'Location added successfully!',
                            'location_id' => $location_id,
                            'image_path' => $imagePath
                        ];
                    } else {
                        $response = ['success' => false, 'error' => 'Failed to save location to database'];
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
    // Always return JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>
