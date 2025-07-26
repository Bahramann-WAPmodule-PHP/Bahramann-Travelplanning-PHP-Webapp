<?php
require '../../config/common_api.php';

try {
    require '../../config/db.php';

    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'User not logged in']);
        exit;
    }

    $userId = $_SESSION['user_id'];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create a new booking
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['location_id'], $input['vehicle_type'], $input['number_of_people'], $input['booking_date'])) {
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit;
        }

        $locationId = intval($input['location_id']);
        $vehicleType = trim($input['vehicle_type']);
        $numberOfPeople = intval($input['number_of_people']);
        $bookingDate = $input['booking_date'];

        // Validate inputs
        if ($locationId <= 0) {
            echo json_encode(['success' => false, 'error' => 'Invalid location ID']);
            exit;
        }

        if ($numberOfPeople <= 0 || $numberOfPeople > 50) {
            echo json_encode(['success' => false, 'error' => 'Number of people must be between 1 and 50']);
            exit;
        }

        // Validate booking date (should be in future)
        if (strtotime($bookingDate) < strtotime('today')) {
            echo json_encode(['success' => false, 'error' => 'Booking date must be in the future']);
            exit;
        }

        // Check if location exists
        $checkLocation = $pdo->prepare("SELECT location_id FROM location WHERE location_id = ?");
        $checkLocation->execute([$locationId]);
        
        if ($checkLocation->rowCount() === 0) {
            echo json_encode(['success' => false, 'error' => 'Location not found']);
            exit;
        }

        // Insert booking
        $stmt = $pdo->prepare("INSERT INTO booking (user_id, location_id, vehicle_type, number_of_people, booking_date) VALUES (?, ?, ?, ?, ?)");
        $result = $stmt->execute([$userId, $locationId, $vehicleType, $numberOfPeople, $bookingDate]);

        if ($result) {
            $bookingId = $pdo->lastInsertId();
            echo json_encode([
                'success' => true, 
                'booking_id' => $bookingId,
                'message' => 'Booking created successfully'
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to create booking']);
        }

    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user's bookings
        $stmt = $pdo->prepare("
            SELECT 
                b.booking_id,
                b.location_id,
                b.vehicle_type,
                b.number_of_people,
                b.booking_date,
                l.location_name,
                l.image_url,
                l.description,
                l.hotel_names,
                l.hotel_prices
            FROM booking b
            JOIN location l ON b.location_id = l.location_id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC
        ");
        
        $stmt->execute([$userId]);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format the response
        $formattedBookings = [];
        foreach ($bookings as $booking) {
            // Parse hotel names and prices
            $hotelNames = $booking['hotel_names'] ? explode(',', $booking['hotel_names']) : ['Hotel'];
            $hotelPrices = $booking['hotel_prices'] ? explode(',', $booking['hotel_prices']) : ['10000'];
            
            // Use first hotel as default (you can enhance this logic later)
            $hotelName = trim($hotelNames[0]);
            $hotelPrice = trim($hotelPrices[0]);
            
            // Fix image URL path - use direct localhost path
            $imageUrl = $booking['image_url'];
            if ($imageUrl) {
                // If it's not already a full URL, convert to localhost path
                if (strpos($imageUrl, 'http') !== 0) {
                    // Remove leading slash if present
                    $imageUrl = ltrim($imageUrl, '/');
                    // Create full localhost URL
                    $imageUrl = 'http://localhost/Bhramanapp/Backend/' . $imageUrl;
                }
            }
            
            $formattedBookings[] = [
                'booking_id' => $booking['booking_id'],
                'location_id' => $booking['location_id'],
                'location_name' => $booking['location_name'],
                'hotel_name' => $hotelName,
                'image_url' => $imageUrl,
                'description' => $booking['description'],
                'vehicle_type' => $booking['vehicle_type'],
                'number_of_people' => $booking['number_of_people'],
                'booking_date' => $booking['booking_date'],
                'price' => floatval(str_replace(['Rs.', 'Rs', ',', ' '], '', $hotelPrice)),
                'total_price' => floatval(str_replace(['Rs.', 'Rs', ',', ' '], '', $hotelPrice)) * $booking['number_of_people']
            ];
        }

        echo json_encode([
            'success' => true,
            'bookings' => $formattedBookings
        ]);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete a booking
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['booking_id'])) {
            echo json_encode(['success' => false, 'error' => 'Booking ID is required']);
            exit;
        }

        $bookingId = intval($input['booking_id']);

        if ($bookingId <= 0) {
            echo json_encode(['success' => false, 'error' => 'Invalid booking ID']);
            exit;
        }

        // Check if booking exists and belongs to the user
        $checkStmt = $pdo->prepare("SELECT booking_id FROM booking WHERE booking_id = ? AND user_id = ?");
        $checkStmt->execute([$bookingId, $userId]);
        
        if ($checkStmt->rowCount() === 0) {
            echo json_encode(['success' => false, 'error' => 'Booking not found or unauthorized']);
            exit;
        }

        // Delete the booking
        $deleteStmt = $pdo->prepare("DELETE FROM booking WHERE booking_id = ? AND user_id = ?");
        $result = $deleteStmt->execute([$bookingId, $userId]);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to delete booking']);
        }
    }

} catch (PDOException $e) {
    error_log('Booking Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('Booking Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>
