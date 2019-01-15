<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	$responseText = $_REQUEST["page"];
	session_start();
	$loggedIn = isset($_SESSION["username"]);
	if($responseText == "generate_sealed") {
		echo logInSealed($loggedIn);
	}
	else if($responseText == "submit_constructed") {
		echo loggedInConstructed($loggedIn);
	}
	else if($responseText == "matches" || $responseText == "create_pairings ") {
		echo loggedInMatches($loggedIn);
	}
	else if($responseText == "menu") {
		echo loggedInMenu($loggedIn);
	}
	else if($responseText == "account") {
		echo loggedInAccount($loggedIn);
	}
	else if($responseText == "create_pairings") {
		echo loggedInCreatePairings($loggedIn);
	}

	function logInSealed($loggedIn) {
		if(!$loggedIn) {
			return json_encode($loggedIn);
		} 
		else {
			$username = $_SESSION["username"];
			$sql = "SELECT * FROM grn_sealed WHERE username='$username'";
			require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
			$result = $conn->query($sql);
			$pool = "";
			while ($row = $result->fetch_assoc()) {
				$pool = $row["sealed_pool"];
			}
			if($pool == "") {
				return json_encode(true);
			} else {
				return str_replace('\\"', '"',json_encode($pool));
			}
		}
	}

	function loggedInConstructed($loggedIn) {
		if(!$loggedIn) {
			return json_encode($loggedIn);
		} else {
			require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
			$table_name = $set . "_constructed";
			$username = $_SESSION["username"];
			$sql = "SELECT * FROM $table_name WHERE username='$username'";
			$result = $conn->query($sql);
			$pool = "";
			while ($row = $result->fetch_assoc()) {
				$pool = $row["deck"]; 
			}
			if($pool == "") {
				return json_encode(true);
			} else {
				return str_replace('\\"', '"',json_encode($pool));
			}
		}
	}

	function loggedInAccount($loggedIn) {
		if($loggedIn) {
			$username = $_SESSION["username"];
			$sql = "SELECT username, avatar FROM users WHERE username='$username' LIMIT 1";
			require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
			$result = $conn->query($sql);
			$output = "";
			if($result->num_rows > 0) {
				while ($row = $result->fetch_assoc()) {
					$output = json_encode($row);
				}
			}
			return $output;
		}
		else {
			return "false";
		}
	}

	function loggedInMenu($loggedIn) {
		if($loggedIn) {
			return $_SESSION["username"];
		}
		else {
			return "null";
		}
	}

	function loggedInMatches($loggedIn) {
		if($loggedIn) {
			return $_SESSION["username"];
		}
		else {
			return "false";
		}
	}

	function loggedInCreatePairings($loggedIn) {
		if($loggedIn) {
			return json_encode($_SESSION["username"] == "certi42" || $_SESSION["username"] == "Manlin Never Lucky");
		}
		else {
			return json_encode($loggedIn);
		}
	}
?>
