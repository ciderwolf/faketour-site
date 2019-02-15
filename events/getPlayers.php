<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = $set . "_constructed";
    $sql = "SELECT username FROM $table_name WHERE 1";
    $result = $conn->query($sql);
    $players = array();
    while ($row = $result->fetch_assoc()) {
        $players[] = $row["username"];
    }
    echo json_encode($players);
?>
