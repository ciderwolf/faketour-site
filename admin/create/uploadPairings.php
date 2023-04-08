<?php
    ini_set("display_errors", 1);
    session_start();
    if(!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
        http_response_code(403);
        header("Content-Type: application/json");
        die(json_encode(["error" => "Forbidden"]));
        return;
    }
    $format = $_REQUEST["format"];
    $round = $_REQUEST["round"];
    $games = $_REQUEST["games"];
    $pairings = json_decode($_SERVER["HTTP_BODY"]);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

    foreach($pairings as $pairingData) {
        $pairing = json_decode(json_encode($pairingData), true);
        $player_one = $pairing["player_one"];
        $player_two = $pairing["player_two"];
        $sql = "INSERT INTO matches (`event`, format, round, games, player_one, player_two, score) VALUES ('$set', '$format', '$round', '$games', '$player_one', '$player_two', '')";
        if ($conn->query($sql) === TRUE) {
            echo $sql;
        } else {
            die("Error updating record: " . $conn->error);
        }
    }
