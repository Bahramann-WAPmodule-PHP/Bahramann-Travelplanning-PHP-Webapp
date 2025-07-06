<?php
require '../config/database.php'; #this is database connection
if (isset($_POST["login"])) {
    $email = $_POST["email"];
    $password = $_POST["password"];
    try {
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {

            if (password_verify($password, $user["password"])) {
                session_start();

                $_SESSION["user"] = "yes";
                header("Location: home.jsx");
                die();
            } else {
                echo "<div class='alert alert-danger'>Password does not match</div>";
            }
        } else {
            echo "<div class='alert alert-danger'>Email does not match</div>";
        }
    } catch (PDOException $e) {
        echo "<div class='alert alert-danger'>Error: " . $e->getMessage() . "</div>";
    }
}
?>
