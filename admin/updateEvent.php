<?php
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $sql = "";
    if(isset($_REQUEST["key"])) {
        $property = $_REQUEST["key"];
        $value = $_REQUEST["value"];
        $sql = "UPDATE events set $property='$value' WHERE open=1";
    } else if(isset($_REQUEST["name"])) {
        $name = $_REQUEST["name"];
        $date = $_REQUEST["date"];
        $code = $_REQUEST["code"];
        $sql = "INSERT INTO events (name, code, decks_due) VALUES ('$name', '$code', '$date')";
        $player_table_name = $code . "_players";
        $matches_table_name = $code . "_matches";
        $create_tables_sql = "CREATE TABLE $player_table_name (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(30) NOT NULL,
            deck VARCHAR(3000),
            reg_date TIMESTAMP
        );
        CREATE TABLE $matches_table_name (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            format VARCHAR(30) NOT NULL,
            round VARCHAR(30) NOT NULL,
            games INT(11) DEFAULT 3,
            player_one VARCHAR(30) NOT NULL,
            player_two VARCHAR(30) NOT NULL,
            score VARCHAR(3000),
            reg_date TIMESTAMP
        )";
        if($conn->query($create_tables_sql) === FALSE) {
            echo "Error creating event tables: " . $conn->error;
        }
    }
    if($sql != "") {
        if ($conn->query($sql) === FALSE) {
            echo "Error updating record: " . $conn->error;
        }
    }
?>