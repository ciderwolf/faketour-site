<?php
    session_start();
    $username = $_SESSION["username"];
    $deck = str_replace("'", "\'", $_SERVER["HTTP_BODY"]);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    if(isset($_REQUEST["set"])) {
        $set = $_REQUEST["set"];
    }

    $sql = "SELECT id FROM players WHERE username='$username' AND `event` = '$set'";
    $result = $conn->query($sql);
    if ($result->num_rows == 0) {
        die("register");
    }

    $sql = "UPDATE players SET deck='$deck' WHERE username=\"$username\" AND `event` = '$set'";
    if ($conn->query($sql) === FALSE) {
        echo "Error updating record: " . $conn->error;
    }
    echo "true";
?>	