<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	$username = $_REQUEST["uname"];
	$password = $_REQUEST["psw"];
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
	
	$sql = "SELECT * FROM users";
	$result = $conn->query($sql);
	$success = false;
	if($result->num_rows > 0) {
		$counter = 0;
		while($row = $result->fetch_assoc()) {
			if($row["password"] == $password && $row["username"] == $username) {
				$success = true;
				session_start();
				$_SESSION["username"] = $username;
				$_SESSION["logged_in"] = true;
				break;
			}
		}
	}
		 
	echo json_encode($success);

?>