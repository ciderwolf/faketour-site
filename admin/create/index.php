<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    if(!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
        require($_SERVER["DOCUMENT_ROOT"] . "/pages/403/index.php");
        return;
    }
?>

<!DOCTYPE html>
<html>
<head>
    <title>Create Pairings | Faketour</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="/menu/styles.css">
    <link rel="stylesheet" href="styles.css"></head>
    <script type="text/javascript" src="/menu/loadMenu.js"></script>
</head>
<body>
    <div class="topnav"></div>
    <script type="text/javascript">loadMenu("Create Pairings");</script>
    <div class="title">
        <h1>Create Pairings</h1>
    </div>
    <div style="align-items: center;" id="matches">
        <h2 style="margin-bottom: 0px;">Round name: <input type="text" name="round-name" id="round-name" placeholder="Round 2"></h2>
        <h2 style="margin-top: 0px;">Games per round: <input type="number" min="1" name="games" id="games" placeholder="3"></h2><br>

        <div id="limited" class="match">
            <h2>Limited</h2>
            <button class="transparent thin" style="position: absolute; right:10vw" onclick="addMatchElement('limited')">Add Pairing</button>
        </div>
        <div id="constructed" class="match">
            <h2>Constructed</h2>
            <button class="transparent thin" style="position: absolute; right:10vw" onclick="addMatchElement('constructed')">Add Pairing</button>
        </div>
    </div>
    <div align="center" onclick="uploadPairings();"><button class="transparent thin" style="margin-top:100px;width:70%">Submit Pairings</button></div>
    

</body>

<script src="createMatches.js" type="text/javascript"></script>

</html>