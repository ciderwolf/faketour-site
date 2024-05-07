<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

    $sql = "SELECT format, round, player_one, player_two, score FROM matches WHERE `event`='$set'";
    

    $matches = [ "limited" => [], "constructed" => [] ];
    $players = [];

    $result = $conn->query($sql);
    while($row = $result->fetch_assoc()) {
        $entry["playerOne"] = $row["player_one"];
        $entry["playerTwo"] = $row["player_two"];
        $entry["record"] = $row["score"];
        $matches[$row["format"]][$row["round"]][] = $entry;
    }

    $sql = "SELECT username FROM players WHERE `event`='$set'";
    $result = $conn->query($sql);
    while($row = $result->fetch_assoc()) {
        $players[] = $row["username"];
    }
    
    $conn->close();

    header("Content-Type: application/json");
    echo json_encode(["matches" => $matches, "players" => $players]);
?>