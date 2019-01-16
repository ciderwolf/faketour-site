<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $format = $_REQUEST["format"];
    $username = $_SESSION["username"];
    $table_name = $set . "_matches";
    $sql = "SELECT round, player_one, player_two, score FROM $table_name WHERE format='$format' AND (player_one='$username' OR player_two='$username') AND score=''";
    $result = $conn->query($sql);
    $output = "";

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $output[] = $row;
        }
        echo json_encode($output);
    } else {
        echo "{}";
    }
    $conn->close();
?>