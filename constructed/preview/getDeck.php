<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    if(isset($_REQUEST["set"])) {
        $set = $_REQUEST["set"];
    }
    $table_name = $set . "_players";
    $username = $_REQUEST["user"];
    $sql = "SELECT * FROM $table_name WHERE username='$username'";
    $result = $conn->query($sql);
    $pool = "";
    while ($row = $result->fetch_assoc()) {
        $pool = $row["deck"]; 
    }
    if($pool == "") {
        echo json_encode(true);
    } else {
        echo str_replace('\\"', '"',json_encode($pool));
    }
?>