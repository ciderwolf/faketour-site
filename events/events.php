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
            $table_name = $set . "_players";
            $sql = "SELECT * FROM $table_name WHERE username='$username'";
            $result = $conn->query($sql);
            if($result->num_rows == 0) {
                $sql = "INSERT INTO $table_name (`username`) VALUES ('$username')";
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