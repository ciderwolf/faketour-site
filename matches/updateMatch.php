<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $score = $_REQUEST["score"];
    $id = $_REQUEST["id"];

    $sql = "UPDATE matches SET score='$score' WHERE id=$id AND `event` = '$set'";
    if ($conn->query($sql) === TRUE) {
        echo "Updated match record";
    } else {
        http_response_code(500);
        die("Error: " . $sql . "<br>" . $conn->error);
    }
    $conn->close();
?>