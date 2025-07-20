<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//        if (!$locationExists) {
            #Add sample location
            $stmt = $conn->prepare("
                INSERT INTO location (location_name, total_rating, number_of_ratings, description, hotel_names, hotel_prices, image_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                'Himalayan Viewpoint', 
                45, 
                10, 
                'Beautiful mountain views with fresh air and hiking trails.',
                'Mountain Lodge Resort,Himalayan Paradise Hotel,Summit View Lodge,Alpine Retreat Center',
                'Rs.5000,Rs.3500,Rs.4200,Rs.6000',
                'uploads/img_687b0d53928890.93497605.png'
            ]);
            echo "<p>Added sample location</p>";uration
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'bhraman';

echo "<h1>Setting up Database</h1>";

try {
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    

    $conn->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    echo "<p>Database '$dbname' created or already exists.</p>";
    

    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        remember_token VARCHAR(255) NULL,
        session_token VARCHAR(255) NULL,
        session_expiry TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'users' created or already exists.</p>";
    
    $sql = "
    CREATE TABLE IF NOT EXISTS location (
        location_id INT AUTO_INCREMENT PRIMARY KEY,
        location_name VARCHAR(100) NOT NULL,
        total_rating INT NOT NULL,
        number_of_ratings INT NOT NULL,
        description TEXT,
        hotel_names TEXT NOT NULL,
        hotel_prices TEXT NOT NULL,
        vehicle_type TEXT,
        image_url VARCHAR(255) NOT NULL
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'location' created or already exists.</p>";
    
    $sql = "
    CREATE TABLE IF NOT EXISTS booking (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        location_id INT NOT NULL,
        vehicle_type VARCHAR(50),
        number_of_people INT NOT NULL,
        booking_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (location_id) REFERENCES location(location_id)
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'booking' created or already exists.</p>";
    
    $sql = "
    CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        location_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        comment TEXT NOT NULL,
        likes INT DEFAULT 0,
        dislikes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES location(location_id)
    )";
    
    $conn->exec($sql);
    echo "<p>Table 'comments' created or already exists.</p>";
    
    if (isset($_GET['sample'])) {
        
        #Check if the test user already exists
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
        
        #Add sample location if it doesn't exist
        $stmt = $conn->prepare("SELECT COUNT(*) FROM location WHERE location_name = ?");
        $stmt->execute(['Himalayan Viewpoint']);
        $locationExists = (int)$stmt->fetchColumn() > 0;
        
        if (!$locationExists) {
            #Add sample location
            $stmt = $conn->prepare("
                INSERT INTO location (location_name, total_rating, number_of_ratings, description, hotel_names, hotel_prices, vehicle_type, image_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                'Himalayan Viewpoint', 
                45, 
                10, 
                'Beautiful mountain views with fresh air and hiking trails.',
                'Mountain Lodge Resort,Himalayan Paradise Hotel,Summit View Lodge,Alpine Retreat Center',
                'Rs.5000,Rs.3500,Rs.4200,Rs.6000',
                'Car,Bus,Bike,SUV',
                'uploads/img_687b0d53928890.93497605.png'
            ]);
            echo "<p>Added sample location</p>";
        } else {
            echo "<p>Sample location already exists</p>";
        }
    }
    
    echo "<p><strong>Database setup completed successfully!</strong></p>";
    echo "<p>You can <a href='?sample=1'>add sample data</a> if needed.</p>";
    
    } catch(PDOException $e) {
    echo "<p style='color:red'>ERROR: " . $e->getMessage() . "</p>";
}

$conn = null;
?>
