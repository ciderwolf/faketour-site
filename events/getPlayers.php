<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

    $sql = "SELECT username FROM players WHERE `event`='$set'";
    $result = $conn->query($sql);
    $players = array();
    while ($row = $result->fetch_assoc()) {
        $players[] = $row["username"];
    }
    echo json_encode($players);
?>
