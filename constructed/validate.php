<?php
    header("Content-Type: application/json");

    $deck = json_decode(file_get_contents('php://input'), true);
    $LEGAL_CARDS = json_decode(file_get_contents("names.json"), true);

    $result = validateDeck($deck["maindeck"], $deck["sideboard"]);
    if (count($result) === 0) {
        echo json_encode(["valid" => true]);
    } else {
        echo json_encode(["valid" => false, "title" => $result[0], "details" => $result[1]]);
    }

    /**
     * @param string[] $maindeck
     * @param string[] $sideboard
     * @return string[]
     */
    function validateDeck($maindeck, $sideboard) {
        $UNLIMITED_CARDS = ["Plains", "Island", "Swamp", "Mountain", "Forest", "Persistent Petitioners"];
        $MAINDECK_SIZE = 60;
        $SIDEBOARD_SIZE = 15;
        $MAX_CARD_COUNT = 4;

        $deck = [];
        $maindeckCount = 0;
        foreach ($maindeck as $line) {
            if(trim($line) === "") {
                continue;
            }
            $elements = explode(" ", $line);
            $count = 1;
            $name = $line;

            if (is_numeric($elements[0])) {
                $count = (int) $elements[0];
                array_splice($elements, 0, 1);
                $name = implode(" ", $elements);
            }
            if (!isset($deck[$name])) {
                $deck[$name] = $count;
            } else {
                $deck[$name] += $count;
            }
            $maindeckCount += $count;
        }

        if ($maindeckCount < $MAINDECK_SIZE) {
            return ["Deck too small", "Your maindeck has only $maindeckCount cards."];
        }

        $sideboardCount = 0;
        foreach ($sideboard as $line) {
            if(trim($line) === "") {
                continue;
            }
            $elements = explode(" ", $line);
            $count = 1;
            $name = $line;

            if (is_numeric($elements[0])) {
                $count = (int) $elements[0];
                array_splice($elements, 0, 1);
                $name = implode(" ", $elements);
            }
            if (!isset($deck[$name])) {
                $deck[$name] = $count;
            } else {
                $deck[$name] += $count;
            }

            $sideboardCount += $count;
        }

        if ($sideboardCount > $SIDEBOARD_SIZE) {
            return ["Sideboard too large", "Your sideboard has $sideboardCount cards."];
        }

        foreach ($deck as $card => $count) {
            if (!isLegal($card)) {
                return ["Illegal card", "'$card' isn't legal in standard."];
            }
            if ($count > $MAX_CARD_COUNT && !in_array($card, $UNLIMITED_CARDS)) {
                return ["Illegal card count", "You have $count copies of '$card' in your deck."];
            }
        }
        return [];
    }

    /**
     * @param string $card
     */
    function isLegal($card) {
        global $LEGAL_CARDS;
        $card = strtolower(trim($card));
        if ($card === "") {
            return true;
        }

        foreach ($LEGAL_CARDS as $cardName) {
            if (strtolower($cardName) == $card) {
                return true;
            }
        }
        return false;
    }
