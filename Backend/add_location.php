<?php
session_start();

$mysqli = new mysqli('localhost', 'root', '', 'bhraman');
if ($mysqli->connect_errno) {
    die("Database connection failed: " . $mysqli->connect_error);
}

$response = null;

// Handle POST with file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');

    if (!isset($_SESSION['user_id'])) {
        $response = ['success' => false, 'error' => 'You must be logged in to post a location'];
    } elseif (empty($title) || empty($description)) {
        $response = ['success' => false, 'error' => 'Title and description are required'];
    } elseif (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $response = ['success' => false, 'error' => 'Image upload failed'];
    } else {
        // Process image
        $uploadDir = __DIR__ . '/uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $imageTmpPath = $_FILES['image']['tmp_name'];
        $imageName = basename($_FILES['image']['name']);
        $imageExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (!in_array($imageExtension, $allowedExtensions)) {
            $response = ['success' => false, 'error' => 'Invalid image file type'];
        } else {
            $newImageName = uniqid('img_', true) . '.' . $imageExtension;
            $imagePath = 'uploads/' . $newImageName;
            $imageFullPath = $uploadDir . $newImageName;

            if (!move_uploaded_file($imageTmpPath, $imageFullPath)) {
                $response = ['success' => false, 'error' => 'Failed to save uploaded image'];
            } else {
                // Save to database
                $stmt = $mysqli->prepare("INSERT INTO locations (title, description, image_path, total_rating, num_ratings) VALUES (?, ?, ?, 0, 0)");
                $stmt->bind_param('sss', $title, $description, $imagePath);

                if ($stmt->execute()) {
                    $response = [
                        'success' => true,
                        'message' => 'Location added successfully!',
                        'location_id' => $stmt->insert_id,
                        'image_path' => $imagePath
                    ];
                } else {
                    $response = ['success' => false, 'error' => 'Database insert failed'];
                }

                $stmt->close();
            }
        }
    }

    // If it's an AJAX request, return JSON
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
    <title>Add Travel Location</title>
</head>
<body>
    <h1>Add a Travel Location</h1>

    <?php if ($response): ?>
        <p style="color: <?= $response['success'] ? 'green' : 'red' ?>;">
            <?= $response['success'] ? $response['message'] : $response['error'] ?>
        </p>
        <?php if (isset($response['image_path'])): ?>
            <p>Image Uploaded: <img src="<?= $response['image_path'] ?>" width="200" alt="Uploaded"></p>
        <?php endif; ?>
    <?php endif; ?>

    <form method="POST" action="" enctype="multipart/form-data">
        <label for="title">Title:</label><br>
        <input type="text" name="title" id="title" required><br><br>

        <label for="description">Description:</label><br>
        <textarea name="description" id="description" rows="4" required></textarea><br><br>

        <label for="image">Image:</label><br>
        <input type="file" name="image" id="image" accept="image/*" required><br><br>

        <button type="submit">Add Location</button>
    </form>
</body>
</html>
