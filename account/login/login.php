<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    $username = $_REQUEST["uname"];
    $password = $_REQUEST["psw"];
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    
    $sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
    $result = $conn->query($sql);
    $success = false;
    if($result->num_rows == 1) {
        session_start();
        $_SESSION["username"] = $username;
        $_SESSION["logged_in"] = true;
        echo "true";
    }
    else {
        echo "false";
    }
?>