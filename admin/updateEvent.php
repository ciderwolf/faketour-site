<?php
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $sql = "";
    if(isset($_REQUEST["key"])) {
        $property = $_REQUEST["key"];
        $value = $_REQUEST["value"];
        $sql = "UPDATE events set $property='$value' WHERE open=1";
    } else if(isset($_REQUEST["name"])) {
        $name = $_REQUEST["name"];
        $date = $_REQUEST["date"];
        $code = $_REQUEST["code"];
        $sql = "INSERT INTO events (name, code, decks_due) VALUES ('$name', '$code', '$date')";
    }
    if($sql != "") {
        if ($conn->query($sql) === FALSE) {
            echo "Error updating record: " . $conn->error;
        }
    }
?>