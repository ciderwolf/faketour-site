<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
	$format = $_REQUEST["format"];
    if($format == "std") {
        $format = "constructed";
    }
    $pairings = json_decode($_SERVER["HTTP_BODY"]);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = "grn_" . $format;
    foreach($pairings as $user => $oppList) {
#        echo $key . " => " . json_encode($value) . "<br>"; 
        $opp = json_encode($oppList);
        $sql = "UPDATE $table_name SET opponents='$opp' WHERE username='$user'";
        if ($conn->query($sql) === TRUE) {
    	    echo $sql;
    	} else {
    		die("Error updating record: " . $conn->error);
    	}
    }


?>	