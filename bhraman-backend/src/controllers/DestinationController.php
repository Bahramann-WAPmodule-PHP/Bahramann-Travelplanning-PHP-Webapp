<?php
namespace App\Controllers;

use App\Models\Destination;
use App\Utils\Response;

class DestinationController {
    private $destinationModel;

    public function __construct() {
        $this->destinationModel = new Destination();
    }

    public function index() {
        $destinations = $this->destinationModel->getAllDestinations();
        Response::json($destinations);
    }

    public function details($id) {
        $destination = $this->destinationModel->getDestinationById($id);
        if ($destination) {
            Response::json($destination);
        } else {
            Response::json(['message' => 'Destination not found'], 404);
        }
    }
}