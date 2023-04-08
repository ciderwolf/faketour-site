<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
session_start();
if (!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
    http_response_code(403);
    header("Content-Type: application/json");
    die(json_encode(["error" => "Forbidden"]));
}

if (!isset($_REQUEST["format"])) {
    http_response_code(400);
    die("`format` must be specified");
}

$format = $_REQUEST["format"];
$names = [];
$cards = [];
header("Content-Type: application/json");
$bulk_result = file_get_contents("https://api.scryfall.com/bulk-data/oracle-cards");
$bulk_info = json_decode($bulk_result, true);
$i = 0;
$handle = fopen($bulk_info["download_uri"], "r");
if ($handle) {
    while (($line = fgets($handle)) !== false) {
        if (strlen($line) <= 2) {
            continue;
        }

        $line = trim($line, "\n,");
        $card = json_decode($line, true);
        $data = process_card($card, $format);

        $names = array_merge($names, $data[0]);
        $cards = array_merge($cards, $data[1]);
    }

    fclose($handle);
}

file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/constructed/preview/cards.json", json_encode($cards, JSON_UNESCAPED_SLASHES));
file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/constructed/names.json", json_encode($names, JSON_UNESCAPED_SLASHES));

echo json_encode(
    [
        "cards" => count($cards),
        "format" => $format
    ]
);

function process_card($card, $format)
{
    $names = [];
    $cards = [];
    if ($card["legalities"][$format] === "legal") {
        $name = $card["name"];
        $typeline = $card["type_line"];
        $cards[$name] = [
            "image_uri" => get_image_uri($card),
            "type" => primary_type($typeline)
        ];
        $names[] = $name;
        if (strpos($name, " // ") !== false) {
            $parts = explode(" // ", $name);
            $names[] = $parts[0];
            $names[] = $parts[1];
        }
    }

    return [$names, $cards];
}

function primary_type($typeline)
{
    $typeline = str_replace("Basic ", "", $typeline);
    $typeline = str_replace("Legendary ", "", $typeline);
    $types = explode(" ", $typeline);
    return $types[0];
}

function get_image_uri($card)
{
    if (isset($card["card_faces"])) {
        return $card["card_faces"][0]["image_uris"]["normal"];
    } else {
        return $card["image_uris"]["normal"];
    }
}
