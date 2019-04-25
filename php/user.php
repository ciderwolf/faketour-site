<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    if(isset($_REQUEST["page"])) {
        $page = $_REQUEST["page"];
        session_start();
        $loggedIn = isset($_SESSION["username"]);
        if($loggedIn) {
            if($page == "generate_sealed") {
                echo logInSealed();
            }
            else if($page == "submit_constructed") {
                echo loggedInConstructed();
            }
            else if($page == "matches" || $page == "create_pairings ") {
                echo loggedInMatches();
            }
            else if($page == "menu") {
                echo loggedInMenu();
            }
            else if($page == "account") {
                echo loggedInAccount();
            }
            else if($page == "create_pairings") {
                echo loggedInCreatePairings();
            }
        } else {
            echo "null";
        }
    } else if(isset($_REQUEST["value"])) {
        $value = $_REQUEST["value"];
        session_start();
        if($value == "username") {
            echo getUsername();
        } else if($value == "loggedIn") {
            echo json_encode(isset($_SESSION["username"]));
        }
    }

    function getUsername() {
        if(isset($_SESSION["username"])) {
            return $_SESSION["username"];
        } 
        return "null";
    }

    function logInSealed() {
        $username = $_SESSION["username"];
        $sql = "SELECT * FROM grn_sealed WHERE username='$username'";
        require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
        $result = $conn->query($sql);
        $pool = "";
        while ($row = $result->fetch_assoc()) {
            $pool = $row["sealed_pool"];
        }
        if($pool == "") {
            return "true";
        } else {
            return str_replace('\\"', '"',json_encode($pool));
        }
    }

    function loggedInConstructed() {
        require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
        $table_name = $set . "_players";
        $username = $_SESSION["username"];
        $sql = "SELECT * FROM $table_name WHERE username='$username'";
        $result = $conn->query($sql);
        $pool = "";
        while ($row = $result->fetch_assoc()) {
            $pool = $row["deck"]; 
        }
        if($pool == "") {
            return "true";
        } else {
            return str_replace('\\"', '"',json_encode($pool));
        }
    }

    function loggedInAccount() {
        $username = $_SESSION["username"];
        $sql = "SELECT username, avatar FROM users WHERE username='$username' LIMIT 1";
        require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
        $result = $conn->query($sql);
        $output = "";
        if($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $output = json_encode($row);
            }
        }
        return $output;
    }

    function loggedInMenu() {
        require "administrator.php";
        $output = array("username" => $_SESSION["username"], "admin" => $administrator);
        return json_encode($output);
    }

    function loggedInMatches() {
        return getUsername();
    }
?>
