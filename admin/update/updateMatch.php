<?php
    $format = $_REQUEST["format"];
    $round = $_REQUEST["round"];
    $player_one = $_REQUEST["playerOne"];
    $player_two = $_REQUEST["playerTwo"];
    $id = $_REQUEST["id"];
    $score = $_REQUEST["score"];
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = $set . "_matches";
    $sql = "UPDATE $table_name SET format='$format', round='$round', player_one='$player_one', player_two='$player_two', score='$score' WHERE id=$id";
    if ($conn->query($sql) === FALSE) {
        die("Error updating record: " . $conn->error);
    }
    echo "success";
?>	