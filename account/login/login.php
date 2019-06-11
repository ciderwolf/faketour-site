<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    if(!isset($silent)) {
        $silent = false;
    }
    $sql = "";
    $username = "";
    if(isset($_POST["password"])) {
        $password = $_POST["password"];
        $username = $_POST["username"];
        $sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
    } else {
        list($username, $token) = explode("-", $_COOKIE["SID"]);
        $sql = "SELECT * FROM users WHERE username='$username' AND token='$token'";
        $_POST["remember"] = "true";
    }
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    
    $result = $conn->query($sql);
    if($result->num_rows == 1) {
        $remember = false;
        $token = "";
        if(isset($_POST["remember"])) {
            $remember = $_POST["remember"] == "true";
            if($remember) {
                $row = $result->fetch_assoc();
                $token = $row["token"];
            }
        }
        require "start_session.php";
        if(!$silent) {
            echo "true";
        }
    }
    else if(!$silent) {
        echo "false";
    }
?>