<?php
// Load database configuration
require_once '../../config/db.php';

session_start();

$response = null;

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Sanitize and validate input
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $hotel_name = trim($_POST['hotel_name'] ?? '');
        $vehicle_type = trim($_POST['vehicle_type'] ?? 'Car');
        $initial_rating = intval($_POST['initial_rating'] ?? 0);

        // Validation
        if (empty($title) || empty($description) || empty($hotel_name)) {
            $response = ['success' => false, 'error' => 'Location name, description, and hotel name are required'];
        } elseif (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $response = ['success' => false, 'error' => 'Please upload a valid image'];
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
                    // Insert into database
                    $number_of_ratings = ($initial_rating > 0) ? 1 : 0;
                    $total_rating = $initial_rating;
                    
                    $stmt = $pdo->prepare("INSERT INTO location (location_name, total_rating, number_of_ratings, description, hotel_name, image_url, vehicle_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    
                    $success = $stmt->execute([
                        $title,
                        $total_rating,
                        $number_of_ratings,
                        $description,
                        $hotel_name,
                        $imagePath,
                        $vehicle_type
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
        // Temporarily show the actual error for debugging
        $response = ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    } catch (Exception $e) {
        error_log('General error in add_location: ' . $e->getMessage());
        $response = ['success' => false, 'error' => 'An unexpected error occurred: ' . $e->getMessage()];
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Travel Location</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f8f9fa; 
            padding: 20px; 
            max-width: 700px; 
            margin: auto; 
        }
        .container {
            background: #fff; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h2 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        label { 
            font-weight: bold; 
            display: block; 
            margin-bottom: 8px; 
            color: #555;
        }
        input, select, textarea { 
            width: 100%; 
            padding: 12px; 
            border: 2px solid #ddd; 
            border-radius: 6px; 
            font-size: 16px;
            box-sizing: border-box;
            transition: border-color 0.3s;
        }
        input:focus, select:focus, textarea:focus {
            border-color: #007bff;
            outline: none;
        }
        textarea {
            height: 100px;
            resize: vertical;
        }
        button { 
            background: #007bff; 
            color: white; 
            border: none; 
            padding: 12px 30px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 16px;
            width: 100%;
            transition: background-color 0.3s;
        }
        button:hover {
            background: #0056b3;
        }
        .message { 
            margin-bottom: 20px; 
            padding: 15px; 
            border-radius: 6px; 
            font-weight: 500;
        }
        .success { 
            background: #d4edda; 
            color: #155724; 
            border: 1px solid #c3e6cb;
        }
        .error { 
            background: #f8d7da; 
            color: #721c24; 
            border: 1px solid #f5c6cb;
        }
        img { 
            max-width: 300px; 
            margin-top: 15px; 
            border-radius: 6px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .required {
            color: #dc3545;
        }
        .help-text {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Add a Travel Location</h2>

        <?php if ($response): ?>
            <div class="message <?= $response['success'] ? 'success' : 'error' ?>">
                <?= $response['success'] ? $response['message'] : $response['error'] ?>
                <?php if (!empty($response['image_path'])): ?>
                    <div><img src="../../<?= $response['image_path'] ?>" alt="Uploaded Location Image"></div>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Location Name <span class="required">*</span></label>
                <input type="text" name="title" id="title" required placeholder="e.g., Himalayan Viewpoint, Sunset Beach" />
            </div>

            <div class="form-group">
                <label for="description">Description <span class="required">*</span></label>
                <textarea name="description" id="description" required placeholder="Describe the location, activities, and what makes it special..."></textarea>
            </div>

            <div class="form-group">
                <label for="hotel_name">Hotel/Accommodation Name <span class="required">*</span></label>
                <input type="text" name="hotel_name" id="hotel_name" required placeholder="e.g., Mountain View Resort, City Center Hotel" />
            </div>

            <div class="form-group">
                <label for="vehicle_type">Recommended Transportation</label>
                <select name="vehicle_type" id="vehicle_type">
                    <option value="Car">Car/Taxi</option>
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Flight">Flight</option>
                    <option value="Bike">Bike/Motorcycle</option>
                    <option value="Walking">Walking</option>
                    <option value="Boat">Boat</option>
                </select>
            </div>

            <div class="form-group">
                <label for="initial_rating">Initial Rating (optional)</label>
                <select name="initial_rating" id="initial_rating">
                    <option value="0">No Rating</option>
                    <option value="1">⭐ (1 star)</option>
                    <option value="2">⭐⭐ (2 stars)</option>
                    <option value="3">⭐⭐⭐ (3 stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="image">Location Image <span class="required">*</span></label>
                <input type="file" name="image" id="image" accept="image/*" required />
                <div class="help-text">Supported formats: JPG, PNG, GIF, WebP</div>
            </div>

            <button type="submit">Add Location</button>
        </form>
    </div>
</body>
</html>
