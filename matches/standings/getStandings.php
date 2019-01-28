<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = $set . "_matches";
    $sql = "SELECT format, round, player_one, player_two, score FROM $table_name";
    $result = $conn->query($sql);

    $output = "";

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $pOne = $row["player_one"];
            $pTwo = $row["player_two"];
            $format = $row["format"];
            if(!isset($output[$pOne])) {
                $output[$pOne] = array("constructed" => emptyResultObj(), "limited" => emptyResultObj());
            }
            if(!isset($output[$pTwo])) {
                $output[$pTwo] = array("constructed" => emptyResultObj(), "limited" => emptyResultObj());
            }
            $scores = "";
            if($row["score"] == "") {
                $scores = array(0,0);
            } else {
                $scores = explode("-", $row["score"]);
            }

            if((int)$scores[0] > (int)$scores[1]) {
                $output[$pOne][$format]["matches"]["wins"] += 1;
                $output[$pTwo][$format]["matches"]["losses"] += 1;
            }
            else if((int)$scores[0] < (int)$scores[1]) {
                $output[$pOne][$format]["matches"]["losses"] += 1;
                $output[$pTwo][$format]["matches"]["wins"] += 1;
            }

            $output[$pOne][$format]["games"]["wins"] += (int)$scores[0];
            $output[$pOne][$format]["games"]["losses"] += (int)$scores[1];
            $output[$pTwo][$format]["games"]["wins"] += (int)$scores[1];
            $output[$pTwo][$format]["games"]["losses"] += (int)$scores[0];
        }
        unset($output[""]);
        echo json_encode($output);
    } else {
        echo "{}";
    }
    $conn->close();

    function emptyResultObj() {
        return array("games" => array("wins" => 0, "losses" => 0), "matches" => array("wins" => 0, "losses" => 0));
    }
?>