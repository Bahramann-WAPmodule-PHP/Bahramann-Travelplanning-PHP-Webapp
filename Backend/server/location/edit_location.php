<?php
require_once '../../config/db.php';
require_once '../../config/common_api.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $id = intval($_POST['id'] ?? 0);
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $hotel_names = trim($_POST['hotel_names'] ?? '');
        $hotel_prices = trim($_POST['hotel_prices'] ?? '');
        $vehicle_type = trim($_POST['vehicle_type'] ?? '');
        $initial_rating = intval($_POST['initial_rating'] ?? 0);
        $imagePath = null;

        if (!$id || empty($title) || empty($description) || empty($hotel_names) || empty($hotel_prices) || empty($vehicle_type)) {
            echo json_encode(['success' => false, 'error' => 'All required fields must be filled.']);
            exit;
        }

        // Handle image upload if provided
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $imageTmpPath = $_FILES['image']['tmp_name'];
            $imageName = basename($_FILES['image']['name']);
            $imageExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            if (!in_array($imageExtension, $allowedExtensions)) {
                echo json_encode(['success' => false, 'error' => 'Invalid image format.']);
                exit;
            }
            $newImageName = uniqid('img_', true) . '.' . $imageExtension;
            $imagePath = 'uploads/' . $newImageName;
            $imageFullPath = $uploadDir . $newImageName;
            if (!move_uploaded_file($imageTmpPath, $imageFullPath)) {
                echo json_encode(['success' => false, 'error' => 'Failed to save image.']);
                exit;
            }
        }

        // Fetch current ratings
        $stmt = $pdo->prepare('SELECT total_rating, number_of_ratings FROM location WHERE location_id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_rating = $row ? intval($row['total_rating']) : 0;
        $number_of_ratings = $row ? intval($row['number_of_ratings']) : 0;

        // If initial_rating is set and not zero, update total_rating and number_of_ratings
        if ($initial_rating > 0) {
            $total_rating = $initial_rating;
            $number_of_ratings = 1;
        }

        $sql = "UPDATE location SET location_name=?, total_rating=?, number_of_ratings=?, description=?, hotel_names=?, hotel_prices=?, vehicle_type=?";
        $params = [$title, $total_rating, $number_of_ratings, $description, $hotel_names, $hotel_prices, $vehicle_type];
        if ($imagePath) {
            $sql .= ", image_url=?";
            $params[] = $imagePath;
        }
        $sql .= " WHERE location_id=?";
        $params[] = $id;

        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute($params);
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Location updated successfully!']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to update location.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'An unexpected error occurred: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
