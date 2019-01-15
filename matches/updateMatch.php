<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	session_start();
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
	$score = $_REQUEST["score"];
	$id = $_REQUEST["id"];
	$table_name = $set . "_matches";
    $sql = "UPDATE $table_name SET score='$score' WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo "Updated match record";
    } else {
        die("Error: " . $sql . "<br>" . $conn->error);
    }
	$conn->close();
?>