<?php
    session_start();
    $username = $_SESSION["username"];
    $deck = str_replace("'", "\'", $_SERVER["HTTP_BODY"]);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = $set . "_players";
    $sql = "UPDATE $table_name SET deck='$deck' WHERE username=\"$username\"";
    if ($conn->query($sql) === FALSE) {
        echo "Error updating record: " . $conn->error;
    }
    echo "true";
?>	