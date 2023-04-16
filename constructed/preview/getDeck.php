<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    header("Content-Type: application/json");
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    if (isset($_REQUEST["set"])) {
        $set = $_REQUEST["set"];
    }

    $username = "";

    if (!isset($_REQUEST["user"])) {
        session_start();
        $username = $_SESSION["username"];
    } else {
        $username = $_REQUEST["user"];
    }

    $sql = "SELECT * FROM players WHERE username='$username' AND `event`='$set'";
    $result = $conn->query($sql);
    $pool = "";
    while ($row = $result->fetch_assoc()) {
        $pool = $row["deck"];
    }
    if ($pool == "") {
        echo json_encode(true);
    } else {
        $cards = json_decode(str_replace('\\"', '"', $pool), true);
        $all_cards = json_decode(file_get_contents("cards.json"), true);

        $response = [];
        foreach ($cards["maindeck"] as $line) {
            if(trim($line) === "") {
                continue;
            }
            [$count, $name] = splitLine($line);
            $card_data = getCard($name, $all_cards);
            $type = $card_data["type"];
            if (!isset($type)) {
                $response[$type] = [];
            }
            $data = [
                "name" => $name,
                "count" => $count,
                "image_uri" => $card_data["image_uri"]
            ];
            $response[$type][] = $data;
        }

        $side = [];
        foreach ($cards["sideboard"] as $line) {
            if(trim($line) === "") {
                continue;
            }
            [$count, $name] = splitLine($line);
            $card_data = getCard($name, $all_cards);
            $data = [
                "name" => $name,
                "count" => $count,
                "image_uri" => $card_data["image_uri"]
            ];
            $side[] = $data;
        }

        $response["Sideboard"] = $side;

        echo json_encode($response);
    }

    /**
     * @param string $line
     */
    function splitLine($line) {
        $elements = explode(" ", $line);
        $count = 1;
        $name = $line;
        if (is_numeric($elements[0])) {
            $count = (int) $elements[0];
            array_splice($elements, 0, 1);
            $name = implode(" ", $elements);
        }

        return [$count, $name];
    }

    function getCard($name, $all_cards) {
        if(isset($all_cards[$name])) {
            return $all_cards[$name];
        } else {
            // maybe this is a split card
            foreach(array_keys($all_cards) as $card) {
                if(strpos($card, " // ") !== false) {
                    $parts = explode(" // ", $card);
                    if($parts[0] === $name) {
                        return $all_cards[$card];
                    }
                }
            }
        }

        return null;
    }
