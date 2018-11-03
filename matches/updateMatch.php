<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	session_start();
	$user_name = $_SESSION["username"];
	$opponent_name = $_REQUEST["opponent"];
	$format = $_REQUEST["format"];
	$opponent_wins = ((int)$_REQUEST["opponentWins"])*3;
	$user_wins = ((int)$_REQUEST["youWins"])*3;
	$table_name = "grn_" . $format;	
    $round = $_REQUEST["round"];
	$user_match_points_delta = 3;
	$opponent_match_points_delta = 0;
	if($opponent_wins > $user_wins) {
		$user_match_points_delta = 0;
		$opponent_match_points_delta = 3;
	}

	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

	$sql = "UPDATE $table_name SET game_points=game_points+$user_wins, match_points=match_points+$user_match_points_delta, rounds_completed=rounds_completed+1 WHERE username=\"$user_name\"";
	if ($conn->query($sql) === TRUE) {
	    echo "Set user wins. ";
	} else {
	    die("Error updating record: " . $conn->error);
	}

	$sql = "UPDATE $table_name SET game_points=game_points+$opponent_wins, match_points=match_points+$opponent_match_points_delta, rounds_completed=rounds_completed+1 WHERE username=\"$opponent_name\"";
	if ($conn->query($sql) === TRUE) {
	    echo "Set opponent wins. ";
	} else {
	    die("Error updating record: " . $conn->error);
	}
    $record = $user_wins/3 . "-" . $opponent_wins/3;
    $sql = "INSERT INTO grn_matches (format, round, player_one, player_two, record) VALUES ('$format', '$round', '$user_name', '$opponent_name', '$record')";
    if ($conn->query($sql) === TRUE) {
        echo "Updated match record";
    } else {
        die("Error: " . $sql . "<br>" . $conn->error);
    }

	$conn->close();
?>