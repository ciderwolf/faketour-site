<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    include $_SERVER["DOCUMENT_ROOT"] . "/php/administrator.php";

    if(!$administrator) {
        header("Location: /");
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
                    echo "<div class='match' id=" . $row["id"] . ">";
                    echo "<label for='format-selector'>Format: </label><select id='format-selector'>";
                    foreach($formats as $format) {
                        echo "<option value='$format'";
                        if($format == $row["format"]) {
                            echo " selected";
                        }
                        echo ">$format</option>";
                    }
                    echo "</select>";
                    echo "<label for='round-name'>Round:</label><input type=text class=short id='round-name' value='" . $row["round"]. "'>";
                    echo "<input type=text id='player-one-name' value='" . $row["player_one"]. "'>";
                    echo "<label for='player-two-name'>vs</label><input type=text id='player-two-name' value='" . $row["player_two"]. "'>";
                    echo "<div class=button-container><button onclick=updateMatch(this.parentElement)>Update Match</button><button class=delete onlclick=deleteMatch(this.parentElement)>Delete Match</button></div>";
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