<?php
// Load configuration files
if (!file_exists('../../config/common_api.php') || !file_exists('../../config/db.php')) {
    die("Configuration files not found. Please check your installation.");
}

require_once '../../config/common_api.php';
require_once '../../config/db.php';

session_start();

$response = null;

// Handle POST with file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $hotel_id = intval($_POST['hotel_id'] ?? 1);
        $vehicle_type = trim($_POST['vehicle_type'] ?? 'Car');
        $initial_rating = intval($_POST['initial_rating'] ?? 0);
        $price_range = trim($_POST['price_range'] ?? '');
        $best_time_to_visit = trim($_POST['best_time_to_visit'] ?? '');
        $location_type = trim($_POST['location_type'] ?? '');

        // Validate required fields
        if (empty($title) || empty($description)) {
            $response = ['success' => false, 'error' => 'Location name and description are required'];
        } elseif (empty($hotel_id)) {
            $response = ['success' => false, 'error' => 'Please select a hotel'];
        } elseif (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $response = ['success' => false, 'error' => 'Please upload a valid image'];
        } else {
            // Process image upload
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
                    // Insert location into database
                    $number_of_ratings = ($initial_rating > 0) ? 1 : 0;
                    $total_rating = $initial_rating;
                    
                    $stmt = $pdo->prepare("INSERT INTO location (location_name, total_rating, number_of_ratings, description, image_url, hotel_id, vehicle_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    
                    if ($stmt->execute([$title, $total_rating, $number_of_ratings, $description, $imagePath, $hotel_id, $vehicle_type])) {
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
        error_log('Add location database error: ' . $e->getMessage());
        $response = ['success' => false, 'error' => 'Database error occurred. Please try again'];
    } catch (Exception $e) {
        error_log('Add location error: ' . $e->getMessage());
        $response = ['success' => false, 'error' => 'An unexpected error occurred. Please try again'];
    }

    // Return JSON for AJAX requests
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
}
?>

<!-- HTML Form -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Travel Location</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input[type="text"], input[type="number"], textarea, select {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        textarea {
            height: 100px;
            resize: vertical;
        }
        input[type="file"] {
            width: 100%;
            padding: 5px;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
        }
        button:hover {
            background-color: #0056b3;
        }
        .message {
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .uploaded-image {
            max-width: 300px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .optional {
            color: #666;
            font-weight: normal;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Add a Travel Location</h1>

        <?php if ($response): ?>
            <div class="message <?= $response['success'] ? 'success' : 'error' ?>">
                <?= $response['success'] ? $response['message'] : $response['error'] ?>
                <?php if (isset($response['image_path'])): ?>
                    <br><br>
                    <strong>Uploaded Image:</strong><br>
                    <img src="../../<?= $response['image_path'] ?>" class="uploaded-image" alt="Uploaded Location Image">
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Location Name: *</label>
                <input type="text" name="title" id="title" required placeholder="e.g., Himalayan Viewpoint, Sunset Beach">
            </div>

            <div class="form-group">
                <label for="description">Description: *</label>
                <textarea name="description" id="description" required placeholder="Describe the location, activities, and what makes it special..."></textarea>
            </div>

            <div class="form-group">
                <label for="hotel_id">Select Hotel: *</label>
                <select name="hotel_id" id="hotel_id" required>
                    <option value="">-- Select a Hotel --</option>
                    <?php
                    try {
                        $hotelStmt = $pdo->query("SELECT hotel_id, hotel_name, price FROM hotel ORDER BY hotel_name");
                        while ($hotel = $hotelStmt->fetch()) {
                            echo "<option value='{$hotel['hotel_id']}'>{$hotel['hotel_name']} - $" . number_format($hotel['price'], 2) . "</option>";
                        }
                    } catch (Exception $e) {
                        echo "<option value='1'>Default Hotel</option>";
                    }
                    ?>
                </select>
            </div>

            <div class="form-group">
                <label for="vehicle_type">Recommended Transportation: *</label>
                <select name="vehicle_type" id="vehicle_type" required>
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
                <label for="initial_rating">Initial Rating <span class="optional">(optional, 1-5)</span>:</label>
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
                <label for="location_type">Location Type <span class="optional">(optional)</span>:</label>
                <select name="location_type" id="location_type">
                    <option value="">-- Select Type --</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Beach">Beach</option>
                    <option value="City">City</option>
                    <option value="Historical">Historical Site</option>
                    <option value="Adventure">Adventure Spot</option>
                    <option value="Religious">Religious Site</option>
                    <option value="Nature">Nature Reserve</option>
                    <option value="Cultural">Cultural Site</option>
                </select>
            </div>

            <div class="form-group">
                <label for="price_range">Price Range <span class="optional">(optional)</span>:</label>
                <select name="price_range" id="price_range">
                    <option value="">-- Select Price Range --</option>
                    <option value="Budget">Budget ($0-$50)</option>
                    <option value="Mid-range">Mid-range ($50-$150)</option>
                    <option value="Luxury">Luxury ($150+)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="best_time_to_visit">Best Time to Visit <span class="optional">(optional)</span>:</label>
                <input type="text" name="best_time_to_visit" id="best_time_to_visit" placeholder="e.g., March to May, Summer months">
            </div>

            <div class="form-group">
                <label for="image">Location Image: *</label>
                <input type="file" name="image" id="image" accept="image/*" required>
                <small style="color: #666;">Supported formats: JPG, PNG, GIF, WebP</small>
            </div>

            <button type="submit">Add Location</button>
        </form>
    </div>
</body>
</html>
