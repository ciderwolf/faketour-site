<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	$format = $_REQUEST["format"];
	$table_name = "grn_" . $format;
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

	$sql = "SELECT username, match_points, has_bye, opponents, rounds_completed FROM $table_name";
	$result = $conn->query($sql);

	$output = "";

	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$entry["match_points"] = (int)$row["match_points"];
			$entry["rounds_completed"] = (int)$row["rounds_completed"];
			$entry["has_bye"] = $row["has_bye"] == "1";
			$entry["opponents"] = json_decode($row["opponents"]);
			$output[$row["username"]] = $entry;
		}
		echo json_encode($output);
	} else {
		echo "0 results";
	}
	$conn->close();
?>