<html>
    <head>
        <title>Not Found | Faketour</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
        <link rel="stylesheet" href="styles.css"></head>
        <link rel="stylesheet" href="/menu/styles.css">
        <script type="text/javascript" src="/menu/loadMenu.js"></script>
    </head>
    <body>
        <div class="content"></div>
        <div class="topnav"></div>
        <script type="text/javascript">loadMenu("Error 404");</script>

        <div align=center class="center">
            <h2 style="font-family: MPlantin; font-size: 30pt; color:white; width:45%">
                Target page gains shroud until your next turn.
                <i>(It can’t be the target of spells, abilitiles, or HTTP requests.)</i>
            </h2>
            <a href="/" id="back"><button style="font-family: MPlantin; font-size: 30pt; color:white; width: 25%">Draw a card</button></a>
        </div>

        <div class="footer"><a href='https://www.jasonchanart.com/'>Artwork by Jason Chan</a></div>
        <div class="status"><?php echo $_SERVER["SERVER_PROTOCOL"] ?> 404 Not Found</div>
    </body>
    <script type="text/javascript">
        if(document.referrer.includes(window.location.origin)) {
            back.onclick = function(e) {
                e.preventDefault();
                history.back();
            }
            back.title = "Go Back";
        }
        else {
            back.title = "Go "
        }
    </script>

</html>