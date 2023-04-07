<?php
    session_start();
    if(!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
        http_response_code(403);
        die(json_encode(["error" => "Unauthorized"]));
    }
    $format = $_REQUEST["format"];
    $round = $_REQUEST["round"];
    $player_one = $_REQUEST["playerOne"];
    $player_two = $_REQUEST["playerTwo"];
    $id = $_REQUEST["id"];
    $score = $_REQUEST["score"];
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

    $sql = "UPDATE matches SET format='$format', round='$round', player_one='$player_one', player_two='$player_two', score='$score' WHERE id=$id AND `event` = '$set'";
    if ($conn->query($sql) === FALSE) {
        die("Error updating record: " . $conn->error);
    }
    echo "success";
?>	