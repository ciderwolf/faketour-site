<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $format = $_REQUEST["format"];
    if(isset($_SESSION["username"])) {
        $username = $_SESSION["username"];

        $sql = "SELECT id, round, games, player_one, player_two, score FROM matches WHERE format='$format' AND (player_one='$username' OR player_two='$username') AND score='' AND `event`='$set'";
        $result = $conn->query($sql);
        $output = array();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                if($row["player_one"] == "") {
                    $row["player_one"] = "Bye";
                }
                if($row["player_two"] == "") {
                    $row["player_two"] = "Bye";
                }
                $output[] = $row;
            }
            echo json_encode($output);
        } else {
            echo "[]";
        }
        $conn->close();
    } else {
        echo "false";
    }
?>