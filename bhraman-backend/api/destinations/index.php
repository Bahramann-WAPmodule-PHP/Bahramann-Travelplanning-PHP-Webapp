<?php
// bhraman-backend/api/destinations/index.php
require_once '../../src/utils/Cors.php';
Cors::enableCors();
// filepath: bhraman-backend/api/destinations/index.php
require_once '../../config/database.php';
require_once '../../src/models/Destination.php';

$database = new Database();
$db = $database->getConnection();

$destination = new Destination($db);

$stmt = $destination->getAllDestinations();
$num = $stmt->rowCount();

if($num > 0) {
    $destinations_arr = array();
    $destinations_arr["destinations"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $destination_item = array(
            "id" => $id,
            "name" => $name,
            "description" => $description,
            "image" => $image
        );
        array_push($destinations_arr["destinations"], $destination_item);
    }

    http_response_code(200);
    echo json_encode($destinations_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No destinations found."));
}
?>