<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	global $json;
	global $pack;

	$set = $_REQUEST["set"];
	$json = json_decode(file_get_contents("cards/$set/pack_data.json"), TRUE);
	$contents = json_decode(file_get_contents("cards/packs.json"), TRUE);
	if(isset($contents[$set]["mythic"]) && rand(0, 8) == 1) {
		buildPack("mythic", 1);
	} else {
		buildPack("rare", 1);
	}
	foreach ($contents[$set] as $rarity => $count) {
		if($rarity!="rare" && $rarity!="mythic") {
			buildPack($rarity, $count);
		}
	}
	$output = json_encode($pack);
    echo $output;

	function buildPack($rarity, $number) {
		$basics = ["Plains", "Island", "Mountain", "Swamp", "Forest"];
		for($i = 0; $i < $number; $i++) {
			$json = $GLOBALS["json"];
			$add = $json[$rarity][rand(0, sizeOf($json[$rarity])-1)];
			$GLOBALS["pack"][] = $add;
		}		
	}
	
	function printJSON($json) {
		$jsonIterator = new RecursiveIteratorIterator(new RecursiveArrayIterator($json), RecursiveIteratorIterator::SELF_FIRST);
		foreach ($jsonIterator as $key => $val) {
		    if(is_array($val)) {
		        echo "$key:<br>";
		    } else {
		        echo "$key => $val<br>";
		    }
		}
	}
?>
