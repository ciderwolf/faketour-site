<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    header("Content-Type: application/json");
    if(!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
        http_response_code(403);
        die(json_encode(["error" => "Unauthorized"]));
    }

    require $_SERVER["DOCUMENT_ROOT"] . "/php/connect_db.php";
    $formats = ["limited", "constructed"];
    $table_name = $set . "_matches";
    $sql = "SELECT id, format, round, player_one as playerOne, player_two as playerTwo, score FROM $table_name WHERE score=''";
    $result = $conn->query($sql);
    $matches = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $matches[] = $row;
        }
    }
    echo json_encode($matches);
?>