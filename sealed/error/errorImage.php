<?php
	// Set the content-type
	header('Content-Type: image/png');

	// Create the image
	$im = imagecreatefrompng("error.png");

	// Create some colors
	$white = imagecolorallocate($im, 255, 255, 255);
	$grey = imagecolorallocate($im, 128, 128, 128);
	$black = imagecolorallocate($im, 0, 0, 0);

	// The text to draw
	$text = $_REQUEST["card"];
	// Replace path by your own font path
	$font = 'BelerenBold.ttf';

	// Add the text
	imagettftext($im, 18, 0, 32, 48, $black, $font, $text);

	// Using imagepng() results in clearer text compared with imagejpeg()
	imagepng($im);
	imagedestroy($im);
?>