<?php

    require("php/connect_db.php");
    if(isset($_REQUEST["set"])) {
        $set = $_REQUEST["set"];
    }
    $require_login = true;
    if(isset($_REQUEST["login"])) {
        $require_login = $_REQUEST["login"] == "true";
    }

    if(isset($_REQUEST["target"])) {
        $target = $_REQUEST["target"];
        $url = "";
        switch($target) {
            case "results":
                $url = "/about/$set/results/";
                break;
            case "decks":
                $url = "/about/$set/results/decks/";
                break;
            case "about";
                $url = "/about/$set/";
                break;
        }
        if($url != "") {
            header("Location: $url");
        } else if($target == "info") {
            $sql = "SELECT name FROM events WHERE code='$set'";
            $result = $conn->query($sql);
            if($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                header("Content-Type: application/json");
                echo json_encode(array("name" => $row["name"], "code" => $set));
            }
        }
    } else {
        session_start();
        if(!isset($_SESSION["username"]) && $require_login == true) {
            echo "0";
            return;
        }
        $username = $_SESSION["username"];
        $sql = "SELECT decks_due, open FROM events WHERE code='$set'";
        $result = $conn->query($sql);
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if($row["open"] == "0") {
                echo "1";
                return;
            }
            $due = strtotime($row["decks_due"]);
            if(time() - $due < 0) {
                if(!$require_login && !isset($_SESSION["username"])) {
                    echo "0";
                    return;
                }

                $sql = "SELECT * FROM players WHERE username='$username' AND `event`='$set'";
                $result = $conn->query($sql);
                if($result->num_rows > 0) {
                    echo "3";
                    return;
                } else {
                    echo "2";
                    return;
                }
            } else {
                echo "4";
                return;
            }
        } else {
            echo "3";
        }
    }

?>