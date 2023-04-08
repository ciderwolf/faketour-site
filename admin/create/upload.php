<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set("display_errors", 1);
session_start();

if (!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
    http_response_code(403);
    die(json_encode(["error" => "Forbidden"]));
}

$format = $_REQUEST["format"];
$round = $_REQUEST["round"];
$games = $_REQUEST["games"];
$data = json_decode(file_get_contents('php://input'), true);
if (count($data) == 0) {
    die(json_encode(["success" => true, "message" => "no matches"]));
}
require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");

$inserts = [];
foreach ($data as $pairing) {
    $player_one = $pairing["player_one"];
    $player_two = $pairing["player_two"];
    $inserts[] = "('$set', '$format', '$round', '$games', '$player_one', '$player_two', '')";
}
$inserts_sql = implode(", ", $inserts);
$sql = "INSERT INTO matches (`event`, format, round, games, player_one, player_two, score) VALUES $inserts_sql";
if ($conn->query($sql) === TRUE) {
    die(json_encode(["success" => true, "message" => "matches inserted"]));
} else {
    die(json_encode(["success" => false, "message" => $conn->error]));
}
