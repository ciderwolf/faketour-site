<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    $username = $_REQUEST["uname"];
    $password = $_REQUEST["psw"];
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $sql = "SELECT * FROM users WHERE username='$username'";
    $result = $conn->query($sql);
    $success = false;
    if($result->num_rows > 0) {
        echo "false";
        return;
    }
    $sql = "INSERT INTO users (username, password) VALUES (\"$username\", \"$password\")";
    if ($conn->query($sql) === TRUE) {
        $success = true;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    if($success) {
        session_start();
        $_SESSION["username"] = $username;
        $_SESSION["logged_in"] = true;
    }

    echo json_encode($success);
?>	