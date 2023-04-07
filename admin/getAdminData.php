<?php
    header("Content-Type: application/json");
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();

    if(!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
        http_response_code(403);
        die(json_encode(["error" => "Unauthorized"]));
    }

    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

    $result = $conn->query("SELECT name, code, decks_due FROM events WHERE open=1");
    $event = null;
    if ($result->num_rows == 1) {
        while($row = $result->fetch_assoc()) {
            $event = $row;
        }
    }

    $users = [];
    $result = $conn->query("SELECT username FROM users");
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row["username"];
        }
    }
    if($event !== null) {
        $players = [];
        $table_name = $event["code"] . "_players";
        $result = $conn->query("SELECT username, (deck != 'null') AS deck FROM $table_name");
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $row["deck"] = $row["deck"] == "1";
                $players[] = $row;
            }
        }
        $event["players"] = $players;
    }

    echo json_encode(["users" => $users, "event" => $event]);
?>