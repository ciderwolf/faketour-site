<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    $username = $_POST["username"];
    $password = $_POST["password"];
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $sql = "SELECT * FROM users WHERE username='$username'";
    $result = $conn->query($sql);
    $success = false;
    if($result->num_rows > 0 || $username == "null") {
        echo "false";
        return;
    }
    $token = bin2hex(openssl_random_pseudo_bytes(16));
    $sql = "INSERT INTO users (username, password, token) VALUES ('$username', '$password', '$token')";
    if ($conn->query($sql) === TRUE) {
        $success = true;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    if($success) {
        $remember = false;
        require("../login/start_session.php");
    }

    echo json_encode($success);
?>	