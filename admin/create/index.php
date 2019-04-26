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
    <title>Create Pairings | Faketour</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="styles.css"></head>
    <link rel="stylesheet" href="/menu/styles.css">
    <script type="text/javascript" src="/menu/loadMenu.js"></script>
</head>
<body>
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