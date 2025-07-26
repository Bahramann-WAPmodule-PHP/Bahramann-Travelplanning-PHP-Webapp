<?php
require '../config/common_api.php';
require '../config/db.php';

echo json_encode(['debug' => true, 'message' => 'Testing database connection']);

try {
    // Test database connection
    echo "\nDatabase connection: OK\n";
    
    // Check if tables exist
    $tables = ['users', 'location', 'booking', 'comment'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "Table $table: EXISTS\n";
            
            // Count rows
            $count = $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
            echo "  - Row count: $count\n";
        } else {
            echo "Table $table: MISSING\n";
        }
    }
    
    // Test user session
    if (isset($_SESSION['user_id'])) {
        echo "User session: Active (user_id: " . $_SESSION['user_id'] . ")\n";
    } else {
        echo "User session: No active session\n";
    }
    
    // Test a simple query on location table
    $stmt = $pdo->query("SELECT location_id, location_name FROM location LIMIT 3");
    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Sample locations:\n";
    foreach ($locations as $loc) {
        echo "  - ID: {$loc['location_id']}, Name: {$loc['location_name']}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
