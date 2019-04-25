<?php
    session_start();
    $administrator = false;
    if(isset($_SESSION["username"])) {
        $username = $_SESSION["username"];
        $sql = "SELECT admin FROM users WHERE username='$username' LIMIT 1";
        require("connect_db.php");
        $result = $conn->query($sql);
        $output = "";
        if($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $output = $row["admin"] == "1";
            }
        }
        $administrator = $output;
    }
?>