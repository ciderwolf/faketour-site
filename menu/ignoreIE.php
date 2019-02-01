<?php
    session_start();
    if(isset($_REQUEST["ignore"]) && $_REQUEST["ignore"] == "true") {
        $_SESSION["ignore_ie"] = true;
    }
    if(isset($_SESSION["ignore_ie"]) && $_SESSION["ignore_ie"] == true) {
        echo "true";
    }
    echo "false";
?>