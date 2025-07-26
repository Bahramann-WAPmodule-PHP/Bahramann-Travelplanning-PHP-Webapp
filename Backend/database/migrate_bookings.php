<?php
require __DIR__ . '/../config/db.php';

try {
    // Add created_at column to booking table if it doesn't exist
    $stmt = $pdo->prepare("SHOW COLUMNS FROM booking LIKE 'created_at'");
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE booking ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        echo "Added created_at column to booking table\n";
    } else {
        echo "created_at column already exists in booking table\n";
    }
    
    // Add status column to booking table for future use
    $stmt = $pdo->prepare("SHOW COLUMNS FROM booking LIKE 'status'");
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE booking ADD COLUMN status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed'");
        echo "Added status column to booking table\n";
    } else {
        echo "status column already exists in booking table\n";
    }
    
    echo "Database migration completed successfully!\n";
    
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>
