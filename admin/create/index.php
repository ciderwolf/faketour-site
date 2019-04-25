<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    include $_SERVER["DOCUMENT_ROOT"] . "/php/administrator.php";

    if(!$administrator) {
        header("Location: /");
    }

    function isAdministrator($loggedIn) {
        if($loggedIn) {
            $username = $_SESSION["username"];
            $sql = "SELECT admin FROM users WHERE username='$username' LIMIT 1";
            require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
            $result = $conn->query($sql);
            $output = "";
            if($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $output = $row["admin"] == "1";
                }
            }
            return $output;
        }
        else {
            return $loggedIn;
        }
    }
?>

<!DOCTYPE html>
<html>
<head>
    <title>Create Pairings | Faketour</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="styles.css"></head>
    <link rel="stylesheet" href="/menu/styles.css">
    <script type="text/javascript" src="/menu/loadMenu.js"></script>
</head>
<iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" style="display:none;"></iframe>

<body style="display: none">
    <div class="topnav"></div>
    <script type="text/javascript">loadMenu();</script>
    <div class="title">
        <h1>Create Pairings</h1>
    </div>
    <div style="align-items: center;" id="matches">
        <h2 style="margin-bottom: 0px;">Round name: <input type="text" name="round-name" id="round-name" placeholder="Round 2"></h2>
        <h2 style="margin-top: 0px;">Games per round: <input type="number" min="1" name="games" id="games" placeholder="3"></h2><br>

        <div id="limited" class="match">
            <h2>Limited</h2>
            <button style="position: absolute; right:10vw" onclick="addMatchElement('limited')">Add Pairing</button>
        </div>
        <div id="constructed" class="match">
            <h2>Constructed</h2>
            <button style="position: absolute; right:10vw" onclick="addMatchElement('constructed')">Add Pairing</button>
        </div>
    </div>
    <div align="center" onclick="uploadPairings();"><button style="margin-top:100px;width:70%">Submit Pairings</button></div>
    

</body>

<script src="createMatches.js" type="text/javascript"></script>

</html>