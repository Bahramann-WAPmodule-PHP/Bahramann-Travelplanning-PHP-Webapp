<?php
// filepath: bhraman-backend/src/models/Booking.php

class Booking {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    public function createBooking($userId, $destinationId, $date, $people) {
        try {
            $query = "INSERT INTO bookings (user_id, destination_id, booking_date, number_of_people) VALUES (:user_id, :destination_id, :booking_date, :number_of_people)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':destination_id', $destinationId);
            $stmt->bindParam(':booking_date', $date);
            $stmt->bindParam(':number_of_people', $people);
            $stmt->execute();
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            return false;
        }
    }

    public function listBookings($userId) {
        try {
            $query = "SELECT * FROM bookings WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return [];
        }
    }
}
?>