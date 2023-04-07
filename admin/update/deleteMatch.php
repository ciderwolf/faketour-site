<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    if(!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
        http_response_code(403);
        die(json_encode(["error" => "Unauthorized"]));
    }
    $id = $_REQUEST["id"];
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

    $sql = "DELETE FROM matches WHERE id='$id' AND `event` = '$set'";
    if ($conn->query($sql) === FALSE) {
        die("Error removing record: " . $conn->error);
    }
?>	