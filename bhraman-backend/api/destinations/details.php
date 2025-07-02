<?php
// bhraman-backend/api/destinations/details.php
require_once '../../src/utils/Cors.php';
Cors::enableCors();
// filepath: bhraman-backend/api/destinations/details.php
require_once '../../config/database.php';
require_once '../../src/models/Destination.php';

$database = new Database();
$db = $database->getConnection();

$destination = new Destination($db);

if (isset($_GET['id'])) {
    $destination->id = $_GET['id'];
    $destination->readDetails();

    if ($destination->name != null) {
        $destination_arr = array(
            "id" => $destination->id,
            "name" => $destination->name,
            "description" => $destination->description,
            "location" => $destination->location,
            "image" => $destination->image
        );

        http_response_code(200);
        echo json_encode($destination_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Destination not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid request. Destination ID is required."));
}
?>