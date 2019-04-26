<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    $id = $_REQUEST["id"];
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = $set . "_matches";
    $sql = "DELETE FROM $table_name WHERE id='$id'";
    if ($conn->query($sql) === FALSE) {
        die("Error removing record: " . $conn->error);
    }
?>	