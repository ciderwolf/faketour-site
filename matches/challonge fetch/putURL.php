<?php
 
$tournament = $_REQUEST["tournament"];
$match = $_REQUEST["match"];
$winner = $_REQUEST["winner"];
$record = $_REQUEST["record"];
$api_key = file_get_contents("challonge.apikey");
$url = "https://api.challonge.com/v1/tournaments/" . $tournament . "/matches/" . $match . ".json?api_key=" . $api_key . "&[match]winner_id=" . $winner . "&[match]scores_csv=" . $record;

//Initiate cURL
$ch = curl_init($url);
 
//Use the CURLOPT_PUT option to tell cURL that
//this is a PUT request.
curl_setopt($ch, CURLOPT_PUT, true);
 
//We want the result / output returned.
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

//Execute the request.
$response = curl_exec($ch);
 
echo $response;