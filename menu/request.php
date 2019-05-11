<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    if(isset($_COOKIE["SID"])) {
        require($_SERVER["DOCUMENT_ROOT"] . "/account/login/login.php");
    } else {
        echo "expired";
    }
    // require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php"); 
?>