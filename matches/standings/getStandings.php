<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

	$sql = "SELECT format, round, player_one, player_two, record FROM grn_matches";
	$result = $conn->query($sql);

	$output = "";

	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$pOne = $row["player_one"];
			$pTwo = $row["player_two"];
			if(!isset($output[$pOne])) {
				$output[$pOne] = array("constructed" => array("wins" => 0, "losses" => 0), "sealed" => array("wins" => 0, "losses" => 0));
			}
			if(!isset($output[$pTwo])) {
				$output[$pTwo] = array("constructed" => array("wins" => 0, "losses" => 0), "sealed" => array("wins" => 0, "losses" => 0));
			}
			$scores = explode("-", $row["record"]);
			$winner = $pTwo;
			if((int)$scores[0] > (int)$scores[1]) {
				$winner = $pOne;
			}
			$output[$pOne][$row["format"]]["wins"] += (int)$scores[0];
			$output[$pOne][$row["format"]]["losses"] += (int)$scores[1];
			$output[$pTwo][$row["format"]]["wins"] += (int)$scores[1];
			$output[$pTwo][$row["format"]]["losses"] += (int)$scores[0];
		}
		unset($output[""]);
		echo json_encode($output);
	} else {
		echo "0 results";
	}
	$conn->close();
?>