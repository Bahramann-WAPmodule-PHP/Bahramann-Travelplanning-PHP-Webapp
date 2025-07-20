<?php
/**
 * Database Migration Script - Update hotel_name to hotel_names and add vehicle_type
 */

require_once '../config/db.php';

echo "<h2>Database Migration: Updating hotel_name to hotel_names and adding vehicle_type</h2>\n";
echo "<pre>\n";

try {
    echo "Starting migration...\n\n";
    
    // 1. Check current table structure
    echo "Step 1: Checking current table structure...\n";
    $stmt = $pdo->query("DESCRIBE location");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $hasHotelName = false;
    $hasHotelNames = false;
    $hasHotelPrices = false;
    $hasVehicleType = false;
    
    foreach ($columns as $column) {
        if ($column['Field'] === 'hotel_name') {
            $hasHotelName = true;
        }
        if ($column['Field'] === 'hotel_names') {
            $hasHotelNames = true;
        }
        if ($column['Field'] === 'hotel_prices') {
            $hasHotelPrices = true;
        }
        if ($column['Field'] === 'vehicle_type') {
            $hasVehicleType = true;
        }
    }
    
    echo "Current structure:\n";
    echo "  - hotel_name=" . ($hasHotelName ? 'EXISTS' : 'NOT FOUND') . "\n";
    echo "  - hotel_names=" . ($hasHotelNames ? 'EXISTS' : 'NOT FOUND') . "\n";
    echo "  - hotel_prices=" . ($hasHotelPrices ? 'EXISTS' : 'NOT FOUND') . "\n";
    echo "  - vehicle_type=" . ($hasVehicleType ? 'EXISTS' : 'NOT FOUND') . "\n\n";
    
    if ($hasHotelName && !$hasHotelNames) {
        // Migration needed: hotel_name exists but hotel_names doesn't
        echo "Step 2: Migration needed - Adding hotel_names column...\n";
        $pdo->exec("ALTER TABLE location ADD COLUMN hotel_names TEXT");
        echo "✓ hotel_names column added\n\n";
        
        echo "Step 3: Copying data from hotel_name to hotel_names...\n";
        $pdo->exec("UPDATE location SET hotel_names = hotel_name WHERE hotel_name IS NOT NULL AND hotel_name != ''");
        echo "✓ Data copied successfully\n\n";
        
        echo "Step 4: Dropping hotel_name column...\n";
        $pdo->exec("ALTER TABLE location DROP COLUMN hotel_name");
        echo "✓ hotel_name column dropped\n\n";
        
    } elseif (!$hasHotelName && !$hasHotelNames) {
        // Neither exists, add hotel_names
        echo "Step 2: Adding hotel_names column...\n";
        $pdo->exec("ALTER TABLE location ADD COLUMN hotel_names TEXT NOT NULL DEFAULT ''");
        echo "✓ hotel_names column added\n\n";
        
    } elseif ($hasHotelNames) {
        echo "Step 2: hotel_names column already exists, skipping migration...\n\n";
    }
    
    // Add hotel_prices column if it doesn't exist
    if (!$hasHotelPrices) {
        echo "Step 3: Adding hotel_prices column...\n";
        $pdo->exec("ALTER TABLE location ADD COLUMN hotel_prices TEXT NOT NULL DEFAULT ''");
        echo "✓ hotel_prices column added\n\n";
    } else {
        echo "Step 3: hotel_prices column already exists, skipping...\n\n";
    }
    
    // Add vehicle_type column if it doesn't exist
    if (!$hasVehicleType) {
        echo "Step 4: Adding vehicle_type column...\n";
        $pdo->exec("ALTER TABLE location ADD COLUMN vehicle_type TEXT NOT NULL DEFAULT ''");
        echo "✓ vehicle_type column added\n\n";
    } else {
        echo "Step 4: vehicle_type column already exists, skipping...\n\n";
    }
    
    // 5. Update sample data with multiple hotels, prices, and vehicle types
    echo "Step 5: Updating sample data with multiple hotels, prices, and vehicle types...\n";
    
    // Update Himalayan Viewpoint
    $stmt = $pdo->prepare("UPDATE location SET 
        hotel_names = ?, 
        hotel_prices = ?, 
        vehicle_type = ? 
        WHERE location_name = ?");
    $stmt->execute([
        'Mountain Lodge Resort,Himalayan Paradise Hotel,Summit View Lodge,Alpine Retreat Center',
        '5000,7500,4500,6000',
        'Car,Bus,Bike,Jeep',
        'Himalayan Viewpoint'
    ]);
    
    // Update other locations if they exist
    $locations = [
        [
            'name' => 'Beach Paradise',
            'hotels' => 'Ocean View Resort,Seaside Hotel,Beach Club',
            'prices' => '8000,6500,5500',
            'vehicles' => 'Car,Bus,Bike'
        ],
        [
            'name' => 'Mountain Trek',
            'hotels' => 'Trek Base Camp,Mountain Inn,Highland Lodge',
            'prices' => '3500,4000,4500',
            'vehicles' => 'Jeep,Car,Bike'
        ]
    ];
    
    foreach ($locations as $location) {
        $checkStmt = $pdo->prepare("SELECT location_id FROM location WHERE location_name = ?");
        $checkStmt->execute([$location['name']]);
        if ($checkStmt->rowCount() > 0) {
            $updateStmt = $pdo->prepare("UPDATE location SET 
                hotel_names = ?, 
                hotel_prices = ?, 
                vehicle_type = ? 
                WHERE location_name = ?");
            $updateStmt->execute([
                $location['hotels'],
                $location['prices'],
                $location['vehicles'],
                $location['name']
            ]);
            echo "✓ Updated {$location['name']}\n";
        }
    }
    echo "✓ Sample data updated\n\n";
    
    // 6. Show current location table structure
    echo "Step 6: Final table structure:\n";
    $stmt = $pdo->query("DESCRIBE location");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "  - {$column['Field']} ({$column['Type']}) {$column['Null']} {$column['Key']} {$column['Default']}\n";
    }
    echo "\n";
    
    // 7. Show sample data
    echo "Step 7: Sample location data:\n";
    $stmt = $pdo->query("SELECT location_name, hotel_names, hotel_prices, vehicle_type FROM location LIMIT 3");
    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($locations as $location) {
        $hotelNames = $location['hotel_names'] ?: 'No hotels';
        $hotelPrices = $location['hotel_prices'] ?: 'No prices';
        $vehicleTypes = $location['vehicle_type'] ?: 'No vehicles';
        echo "  - {$location['location_name']}:\n";
        echo "    Hotels: {$hotelNames}\n";
        echo "    Prices: {$hotelPrices}\n";
        echo "    Vehicles: {$vehicleTypes}\n\n";
    }
    echo "\n";
    
    echo "✅ Migration completed successfully!\n";
    echo "✅ Hotel names and prices are now stored as comma-separated values.\n";
    echo "✅ Vehicle types are now stored as comma-separated values.\n";
    echo "✅ The booking dropdown will now show location-specific hotels and vehicles.\n\n";
    
    echo "Next steps:\n";
    echo "1. Test the booking page to see hotel and vehicle dropdown options\n";
    echo "2. Add new locations with multiple hotel names, prices, and vehicle types using the add_location form\n";
    echo "3. Update the frontend to display both hotel and vehicle selection dropdowns\n";
    
} catch (PDOException $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
    echo "Please check your database connection and try again.\n";
} catch (Exception $e) {
    echo "❌ Unexpected error: " . $e->getMessage() . "\n";
}

echo "</pre>\n";
?>
