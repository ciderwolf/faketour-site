<?php
    session_start();
	$username = $_SESSION["username"];
    $deck = str_replace("'", "\'", $_SERVER["HTTP_BODY"]);
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    
    $sql = "UPDATE grn_constructed SET deck='$deck' WHERE username=\"$username\"";
	if ($conn->query($sql) === TRUE) {
	} else {
		echo "Error updating record: " . $conn->error;
	}
    echo "true";
?>	