<?php
    header('Content-Type: application/json');

    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = $set . "_players";
    $sql = "SELECT username, deck FROM $table_name";
    $result = $conn->query($sql);
    $pool = [];
    while ($row = $result->fetch_assoc()) {
        $pool[$row["username"]] = json_decode($row["deck"]);
    }

    echo str_replace("\\/", "/", json_encode($pool));

?>