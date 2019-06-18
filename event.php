<?php

    require("php/connect_db.php");

    if(isset($_REQUEST["target"])) {
        $target = $_REQUEST["target"];
        $url = "";
        switch($target) {
            case "results":
                $url = "/about/$set/results/";
                break;
            case "decks":
                $url = "/about/$set/results/decks";
                break;
            case "about";
                $url = "/about/$set/";
                break;
        }
        header("Location: $url");
    } else {
        $sql = "SELECT decks_due, open FROM events WHERE code='$set'";
        $result = $conn->query($sql);
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if($row["open"] == "0") {
                echo "0";
                return;
            }
            $due = strtotime($row["decks_due"]);
            if(time() - $due < 0) {
                echo "1";
                return;
            } else {
                echo "2";
                return;
            }
        } else {
            echo "1";
        }
    }

?>