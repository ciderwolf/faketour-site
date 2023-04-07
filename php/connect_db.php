<?php
    require "env.php";
	$conn = new mysqli($DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_DATABASE);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $result = $conn->query("SELECT * FROM `events` ORDER BY `open` DESC, `events`.`id` DESC LIMIT 1");
    $set = $result->fetch_assoc()["code"];
?>