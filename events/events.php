<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    if(isset($_REQUEST["reg"])) {
        registerForEvent($_REQUEST["reg"]);
    }
    else {
        require($_SERVER["DOCUMENT_ROOT"] . "/php/connect_db.php");
        $sql = "SELECT `name`, `code`, `open` FROM events";
        $output = [];
        $result = $conn->query($sql);
        if($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $row["open"] = $row["open"] == "1";
                $output[] = $row;
            }
        }
        echo json_encode($output);
    }
    
    function registerForEvent($event) {
        require($_SERVER["DOCUMENT_ROOT"] . "/php/connect_db.php");
        if(!isset($_SESSION["username"])) {
            echo "login";
            return;
        }
        $username = $_SESSION["username"];
        $sql = "SELECT * FROM events WHERE code='$event'";
        $result = $conn->query($sql);
        if($result->num_rows > 0) {

            $sql = "SELECT * FROM players WHERE username='$username' AND `event`='$set'";
            $result = $conn->query($sql);
            if($result->num_rows == 0) {
                $sql = "INSERT INTO players (`event`, `username`) VALUES ('$set', '$username')";
                if ($conn->query($sql) === FALSE) {
                    echo "Error updating record: " . $conn->error;
                }
                echo "success";
            } else {
                echo "duplicate";
            }
        } else {
            echo "invalid";
        }
    }
?>