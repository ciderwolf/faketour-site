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
			$format = $row["format"];
			if(!isset($output[$pOne])) {
				$output[$pOne] = array("constructed" => emptyResultObj(), "sealed" => emptyResultObj());
			}
			if(!isset($output[$pTwo])) {
				$output[$pTwo] = array("constructed" => emptyResultObj(), "sealed" => emptyResultObj());
			}
			$scores = explode("-", $row["record"]);

			if((int)$scores[0] > (int)$scores[1]) {
				$output[$pOne][$format]["matches"]["wins"] += 1;
				$output[$pTwo][$format]["matches"]["losses"] += 1;
			}
			else if((int)$scores[0] < (int)$scores[1]) {
				$output[$pOne][$format]["matches"]["losses"] += 1;
				$output[$pTwo][$format]["matches"]["wins"] += 1;
			}

			$output[$pOne][$format]["games"]["wins"] += (int)$scores[0];
			$output[$pOne][$format]["games"]["losses"] += (int)$scores[1];
			$output[$pTwo][$format]["games"]["wins"] += (int)$scores[1];
			$output[$pTwo][$format]["games"]["losses"] += (int)$scores[0];
		}
		unset($output[""]);
		echo json_encode($output);
	} else {
		echo "0 results";
	}
	$conn->close();

	function emptyResultObj() {
		return array("games" => array("wins" => 0, "losses" => 0), "matches" => array("wins" => 0, "losses" => 0));
	}
?>