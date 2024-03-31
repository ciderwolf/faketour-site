<?php
    $url = "";

    if(isset($_REQUEST["bg"])) {
        $url = getBackground($_REQUEST["bg"]);
    } else if(isset($_REQUEST["image"])) {
        $target = $_REQUEST["image"];
        $url = getImagePath($target);
    } else if(isset($_REQUEST["artist"])) {
        $artists = json_decode(file_get_contents("artists.json"), true);
        header("Content-Type: application/json");
        if(isset($artists[$_REQUEST["artist"]])) {
            echo json_encode($artists[$_REQUEST["artist"]]);
            return;
        } else {
            echo json_encode(false);
            return;
        }
    }

    header("Location: $url");


    function getBackground($target) {
        if($target == "current_bg") {
            require("../php/connect_db.php");
            return "/about/$set/bg_splash.jpg";
        }
        foreach(["_bg.jpeg", "_bg.jpg"] as $extension) {
            if(file_exists($target . $extension)) {
                return $target . $extension;
            }
        }
        return "";
    }

    function getImagePath($target) {
        require("../php/connect_db.php");
        return "/about/$set/$set-logo.png";
    }
?>
