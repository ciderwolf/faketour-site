<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $sql = "SELECT decks_due FROM events WHERE code='$set' LIMIT 1";
    $result = $conn->query($sql);
    echo $result->fetch_assoc()["decks_due"];
?>