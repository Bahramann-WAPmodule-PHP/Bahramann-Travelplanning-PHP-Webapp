<?php
// filepath: bhraman-backend/src/models/Destination.php

class Destination {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    public function getAllDestinations() {
        $query = "SELECT * FROM destinations";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDestinationById($id) {
        $query = "SELECT * FROM destinations WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createDestination($data) {
        $query = "INSERT INTO destinations (name, description, image) VALUES (:name, :description, :image)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':image', $data['image']);
        return $stmt->execute();
    }

    public function updateDestination($id, $data) {
        $query = "UPDATE destinations SET name = :name, description = :description, image = :image WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':image', $data['image']);
        return $stmt->execute();
    }

    public function deleteDestination($id) {
        $query = "DELETE FROM destinations WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>