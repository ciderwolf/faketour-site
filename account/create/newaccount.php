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
			if($row["username"] == $username) {
				$success = false;
				echo json_encode($success);
				return;
			}
		}
	}
#    echo "logging in";
	$sql = "INSERT INTO users (username, password) VALUES (\"$username\", \"$password\")";
	if ($conn->query($sql) === TRUE) {
		$success = true;
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}

	$sql = "INSERT INTO grn_sealed (username) VALUES (\"$username\")";
	if ($conn->query($sql) === TRUE) {
		$success = true;
	} else {
		$success = false;
		echo "Error: " . $sql . "<br>" . $conn->error;
	}

	$sql = "INSERT INTO grn_constructed (username) VALUES (\"$username\")";
	if ($conn->query($sql) === TRUE) {
		$success = true;
	} else {
		$success = false;
		echo "Error: " . $sql . "<br>" . $conn->error;
	}

	if($success) {
		session_start();
		$_SESSION["username"] = $username;
		$_SESSION["logged_in"] = true;
	}

	echo json_encode($success);
?>	