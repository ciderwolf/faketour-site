<?php
    http_response_code(403);
?>

<html>
    <head>
        <title>Forbidden | Faketour</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
        <link rel="stylesheet" href="/menu/styles.css">
        <script type="text/javascript" src="/menu/loadMenu.js"></script>
        <link rel="stylesheet" href="/pages/styles.css">
        <style type="text/css">
            body {
                background-color: #5b8171;
            }
            .content:before {
                background-image: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("/pages/403/rules-lawyer.jpg");
                background-position: top center;
            }
        </style>
    </head>
    <body>
        <div class="content"></div>
        <div class="topnav"></div>
        <script type="text/javascript">loadMenu("Error 403");</script>

        <div align=center class="center">
            <h2 class=quote>
                407.1. Earlier versions of the Magic rules included an ante rule as a way 
                of playing “for keeps.” Playing for ante is strictly forbidden under the Magic: 
                The Gathering Tournament Rules.
            </h2>
            <a href="/" id="back"><button>Call a judge</button></a>
        </div>

        <div class="footer"><a href='https://twitter.com/algenpfleger'>Artwork by @algenpfleger</a></div>
        <div class="status"><?php echo $_SERVER["SERVER_PROTOCOL"] ?> 403 Forbidden</div>
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
            back.title = "Go Home";
        }
    </script>

</html>