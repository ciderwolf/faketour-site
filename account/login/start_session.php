<?php
    // $username, $token, $remember
    if(!isset($conn)) {
        require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php"); 
    }
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION["username"] = $username;
    $_SESSION["logged_in"] = true;
    $_SESSION["admin"] = isAdministrator($username, $conn);
    if($remember && !isset($_COOKIE["SID"])) {
        setcookie("SID", $username . "-" . $token, time() + 3600 * 24 * 365, "/"); // set cookie for 365 days
    }

    function isAdministrator($username, $conn) {
        $administrator = false;
        $sql = "SELECT admin FROM users WHERE username='$username' LIMIT 1";
        $result = $conn->query($sql);
        $output = "";
        if($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $output = $row["admin"] == "1";
            }
        }
        $administrator = $output;
        return $administrator;
    }
?>