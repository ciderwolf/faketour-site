<?php
    session_start();
    $username = $_SESSION["username"];
    $deck = str_replace("'", "\'", $_SERVER["HTTP_BODY"]);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    if(isset($_REQUEST["set"])) {
        $set = $_REQUEST["set"];
    }
    $table_name = $set . "_players";
    $sql = "SELECT id FROM $table_name WHERE username='$username'";
    $result = $conn->query($sql);
    if ($result->num_rows == 0) {
        die("register");
    }

    $sql = "UPDATE $table_name SET deck='$deck' WHERE username=\"$username\"";
    if ($conn->query($sql) === FALSE) {
        echo "Error updating record: " . $conn->error;
    }
    echo "true";
?>	