<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	$sets = explode(",", $_REQUEST["sets"]);
	$pool = array();
	foreach($sets as $set) {
		$pack = generatePack($set);
		// echo json_encode($pack) . "<br>";
		if(isset($pool[$set])) {
			$pool[$set] = array_merge($pool[$set], $pack);
		} else {
			$pool[$set] = $pack;
		}
	}
	echo json_encode($pool);

	function generatePack($set) {
		$json = json_decode(file_get_contents("cards/$set/pack_data.json"), TRUE);
		$contents = json_decode(file_get_contents("cards/packs.json"), TRUE);
		$pack = array();
		if(isset($contents[$set]["mythic"]) && rand(0, 8) == 1) {
			$pack = array_merge($pack, buildPack("mythic", 1, $json));
		} else {
			$pack = array_merge($pack, buildPack("rare", 1, $json));
		}
		foreach ($contents[$set] as $rarity => $count) {
			if($rarity!="rare" && $rarity!="mythic") {
				$pack = array_merge($pack, buildPack($rarity, $count, $json));
			}
		}
		return $pack;
	}
	function buildPack($rarity, $number, $json) {
		$basics = ["Plains", "Island", "Mountain", "Swamp", "Forest"];
		$output = array();
		for($i = 0; $i < $number; $i++) {
			// $json = $GLOBALS["json"];
			$add = $json[$rarity][rand(0, sizeOf($json[$rarity])-1)];
			$output[] = $add;
		}
		return $output;
	}

	// echo json_encode($pool);
?>