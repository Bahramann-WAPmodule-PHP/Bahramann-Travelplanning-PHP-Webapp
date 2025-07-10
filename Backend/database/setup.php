<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'bhramanv2';

echo "<h1>Setting up Database</h1>";

try {
    // Connect without database first (to create it)
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $conn->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    echo "<p>Database '$dbname' created or already exists.</p>";
    
    // Connect to the database
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create users table
    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        session_token VARCHAR(255) NULL,
        session_expiry TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'users' created or already exists.</p>";
    
    // Create hotel table
    $sql = "
    CREATE TABLE IF NOT EXISTS hotel (
        hotel_id INT AUTO_INCREMENT PRIMARY KEY,
        hotel_name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        number_of_rooms INT NOT NULL
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'hotel' created or already exists.</p>";
    
    // Create location table
    $sql = "
    CREATE TABLE IF NOT EXISTS location (
        location_id INT AUTO_INCREMENT PRIMARY KEY,
        location_name VARCHAR(100) NOT NULL,
        total_rating INT NOT NULL,
        number_of_ratings INT NOT NULL,
        description TEXT,
        image_url VARCHAR(255) NOT NULL,
        hotel_id INT NOT NULL,
        vehicle_type VARCHAR(50) NOT NULL,
        FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id)
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'location' created or already exists.</p>";
    
    // Create booking table
    $sql = "
    CREATE TABLE IF NOT EXISTS booking (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        hotel_id INT NOT NULL,
        vehicle_type VARCHAR(50),
        number_of_rooms INT NOT NULL,
        booking_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id)
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'booking' created or already exists.</p>";
    
    // Create comment table
    $sql = "
    CREATE TABLE IF NOT EXISTS comment (
        comment_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        location_id INT NOT NULL,
        comment TEXT NOT NULL,
        comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (location_id) REFERENCES location(location_id)
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'comment' created or already exists.</p>";
    
    // Add sample user if requested
    if (isset($_GET['sample'])) {
        // Check if the test user already exists
        $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute(['test@example.com']);
        $userExists = (int)$stmt->fetchColumn() > 0;
        
        if (!$userExists) {
            $passwordHash = password_hash('password123', PASSWORD_DEFAULT);
            $stmt = $conn->prepare("
                INSERT INTO users (username, email, password) 
                VALUES (?, ?, ?)
            ");
            $stmt->execute(['Test User', 'test@example.com', $passwordHash]);
            echo "<p>Added sample user: test@example.com / password123</p>";
        } else {
            echo "<p>Sample user already exists</p>";
        }
        
        // Add sample hotel if it doesn't exist
        $stmt = $conn->prepare("SELECT COUNT(*) FROM hotel WHERE hotel_name = ?");
        $stmt->execute(['Mountain View Resort']);
        $hotelExists = (int)$stmt->fetchColumn() > 0;
        
        if (!$hotelExists) {
            $stmt = $conn->prepare("
                INSERT INTO hotel (hotel_name, price, number_of_rooms) 
                VALUES (?, ?, ?)
            ");
            $stmt->execute(['Mountain View Resort', 199.99, 50]);
            $hotelId = $conn->lastInsertId();
            
            // Add sample location
            $stmt = $conn->prepare("
                INSERT INTO location (location_name, total_rating, number_of_ratings, description, image_url, hotel_id, vehicle_type) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                'Himalayan Viewpoint', 
                45, 
                10, 
                'Beautiful mountain views with fresh air and hiking trails.',
                '/assets/images/himalayan-view.jpg',
                $hotelId,
                'Car'
            ]);
            echo "<p>Added sample hotel and location</p>";
        } else {
            echo "<p>Sample hotel already exists</p>";
        }
    }
    
    echo "<p><strong>Database setup completed successfully!</strong></p>";
    echo "<p>You can <a href='?sample=1'>add sample data</a> if needed.</p>";
    
} catch(PDOException $e) {
    echo "<p style='color:red'>ERROR: " . $e->getMessage() . "</p>";
}

$conn = null;
?>
