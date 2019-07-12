<?php
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

    $username = $_REQUEST["user"];
    $new_password = $_REQUEST["password"];
    $token = $_REQUEST["token"];
    $result = $conn->query("SELECT password, email_code from users where username='$username'");
    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $password = $row["password"];
        $random_bytes = $row["email_code"];
        $correct_token = md5($random_bytes . $password);
        if($token != $correct_token) {
            die("link expired");
        }
    } else {
        die("invalid user");
    }

    $result = $conn->query("UPDATE users SET password='$new_password', email_code='' WHERE username='$username'");
    if($result === true) {
        echo "true";
    } else {
        echo "failed to update password";
    }
?>