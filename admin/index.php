<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    session_start();
    if(!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
        require($_SERVER["DOCUMENT_ROOT"] . "/pages/403/index.php");
        return;
    }

    function getData($sql) {
        require($_SERVER["DOCUMENT_ROOT"] . "/php/connect_db.php");
        $result = $conn->query($sql);
        $output = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $output[] = $row;
            }
        }
        return $output;
    }

    function getDataSingular($sql) {
        $rows = getData($sql);
        if(sizeof($rows) > 0) {
            return $rows[0];
        }
        return array();
    }
?>

<html>
<head>
    <title>Admin | Faketour</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <script type="text/javascript" src="/menu/loadMenu.js"></script>
    <link rel="stylesheet" href="/menu/styles.css">
    <link rel="stylesheet" href="styles.css">
    <script type="text/javascript" src="admin.js"></script>
</head>
<body>
    <div class="topnav"></div>
    <script type="text/javascript">loadMenu("Admin");</script>
    <h1 style="margin-left:30px">Faketour Administration Station</h1>
    <div class='section' style="display:flex">
        <div>
            <h2>Events</h2>
            <div class='section'>        
            <?php
                $event = getDataSingular("SELECT * FROM events WHERE open=1");
                if(sizeof($event) > 0) {
                    echo "<h3>" . $event["name"] . "</h3>";
                    echo "<label for='event-duedate-input'>Decks submission due: </label>";
                    echo "<input type=text id='event-duedate-input' value='" . $event["decks_due"] . "'></input><br>";
                    echo "<button class='transparent danger thin' id='close-event-button' onclick='closeEvent()'>Close Event</button>";
                    echo "<button class='transparent thin' id='update-duedate-button' onclick='updateDueDate()'>Update Submission Date</button>";
                    echo "</div></div><div style='margin:3.33em'><h3>Registered Players &emsp; <i style='color: #676970; font-size:0.8em'>(⭑ submitted deck)</i></h3><p>";
                    $players = getData("SELECT username, deck FROM players WHERE `event`='" . $event["code"] . "'");
                    foreach($players as $player) {
                        echo $player["username"];
                        if($player["deck"] != "") {
                            echo "&emsp; ⭑";
                        }
                        echo "<br>";
                    }
                    echo "</p></div>";
                } else {
                    echo "<h3>New Event</h3>";
                    echo "<label for='event-name-input'>Event name: </label>";
                    echo "<input type=text id='event-name-input' placeholder='Shadows over Innistrad'></input>";
                    echo "<label for='event-code-input'>Event set code: </label>";
                    echo "<input type=text id='event-code-input' placeholder='soi'></input>";
                    echo "<label for='event-duedate-input'>Decks due: </label>";
                    echo "<input type=text id='event-duedate-input' placeholder='Oct 29 2015'></input><br/>";
                    echo "<button class='transparent' onclick='uploadEvent()'>Create Event</button>";
                }
            ?>
            </div>
        </div>
    </div>
    <div class='section'>
        <h2>Users</h2>
        <div class='section'>
        <p style="margin:30px;">
        <?php 
            $users = getData("SELECT username FROM users");
            for($i = 0; $i < sizeof($users); $i += 1) {
                echo $users[$i]["username"];
                if($i != sizeof($users) - 1) {
                    echo "<br>";
                }
            }
        ?>
        </div>
        </p>
    </div>
    <div class='section'>
        <h2>Matches</h2>
        <div class='section'>
            <a href='create/'><button class="transparent thin">Create Pairings</button></a>
            <a href='update/'><button class="transparent thin">Update Pairings</button></a>
        </div>
    </div>
</body>
</html>