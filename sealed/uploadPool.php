<?php
    session_start();
	$username = $_SESSION["username"];
    $pool = str_replace("'", "\'", $_SERVER["HTTP_BODY"]);
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $sql = "UPDATE grn_sealed SET sealed_pool='$pool' WHERE username=\"$username\"";
    echo $sql;
	if ($conn->query($sql) === TRUE) {
	    echo $output;
	} else {
		echo "Error updating record: " . $conn->error;
	}
?>	