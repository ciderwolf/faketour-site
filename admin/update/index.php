<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    if(!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
        header("Location: /pages/403/");
    }
?>

<!DOCTYPE html>
<html>
<head>
    <title>Update Pairings | Faketour</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="styles.css"></head>
    <link rel="stylesheet" href="/menu/styles.css">
    <script type="text/javascript" src="/menu/loadMenu.js"></script>
</head>
<body>
    <div class="topnav"></div>
    <script type="text/javascript">loadMenu();</script>
    <div style="margin-left: 30px">
        <h1>Update Pairings</h1>
        <?php
            require $_SERVER["DOCUMENT_ROOT"] . "/php/connect_db.php";
            $formats = ["limited", "constructed"];
            $table_name = $set . "_matches";
            $sql = "SELECT * FROM $table_name WHERE score=''";
            $result = $conn->query($sql);
            $matches = array();
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $matches[] = $row;
                    $id = $row["id"];
                    echo "<div class='match' id=$id>";
                    echo "<label for='format-selector'>Format: </label><select name='format-selector' id='format-selector$id'>";
                    foreach($formats as $format) {
                        echo "<option value='$format'";
                        if($format == $row["format"]) {
                            echo " selected";
                        }
                        echo ">$format</option>";
                    }
                    echo "</select>";
                    echo "<label for='round-name'>Round:</label><input type=text class=short name='round-name' id='round-name$id' value='" . $row["round"]. "'>";
                    echo "<input type=text id='player-one-name$id' value='" . $row["player_one"]. "'>";
                    echo "<label for='player-two-name'>vs</label><input type=text id='player-two-name$id' name='player-two-name' value='" . $row["player_two"]. "'>";
                    echo "<label for='score'>Score:</label><input class=short type=text id='score$id' name='score'></input>";
                    echo "<div class=button-container><button class='transparent' onclick=updateMatch(this.parentElement.parentElement)>Update Match</button><button class=delete onclick=deleteMatch(this.parentElement.parentElement)>Delete Match</button></div>";
                    echo "</div>";
                }
            } else {
                echo "<h2>No active pairings right now</h2>";
            }
        ?>
    </div>
</body>

<script src="updateMatches.js" type="text/javascript"></script>

</html>