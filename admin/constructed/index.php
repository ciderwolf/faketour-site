<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
session_start();
if (!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
    require($_SERVER["DOCUMENT_ROOT"] . "/pages/403/index.php");
    return;
}

$random_card = json_decode(file_get_contents("https://api.scryfall.com/cards/random"), true);
$formats = array_keys($random_card["legalities"]);
?>

<!DOCTYPE html>
<html>

<head>
    <title>Set Constructed Format | Faketour</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="/menu/styles.css">
    <link rel="stylesheet" href="styles.css">
</head>
<script type="text/javascript" src="/menu/loadMenu.js"></script>
</head>

<body>
    <div class="topnav"></div>
    <script type="text/javascript">
        loadMenu("Constructed Format");
    </script>
    <div class="title">
        <h1>Set Constructed Format</h1>
    </div>
    <div style="align-items: center;" id="matches">
        <h2 style="margin-bottom: 0px;">Choose Format:
            <select id="format">
                <?php
                foreach ($formats as $format) {
                    echo "<option value=\"$format\">$format</option>";
                }
                ?>
            </select>
        </h2>
        <div align="center">
            <button class="transparent thin" id="download-button" onclick="downloadCards();">
                <span style="display:none;" class="button-spinner">
                    <svg viewBox="0 0 50 50" class="button-spinner-inner" style="width: 20px; height: 20px;">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="#efefef" stroke-width="5" class="path"></circle>
                    </svg>
                </span> Download Legal Cards
            </button>
        </div>
    </div>
</body>
<script src="constructed.js" type="text/javascript"></script>

</html>