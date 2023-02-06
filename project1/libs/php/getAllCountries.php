<?php
    
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

   
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);


    $url ="http://localhost/project1/libs/resources/countryBorders.geo.json";

	// $url ="https://shabnaseethi.epizy.com/project1/libs/resources/countryBorders.geo.json";



	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
    

	curl_close($ch);

	$decode = json_decode($result,true);	
    
    $i=0;
	
	$result;
    foreach($decode["features"] as $item){   
    $output[$i] = $item['properties'];
    $i++;
    }

	// $filtered = array_filter(
	// 	$output,
	// 	function($obj){ 
	// 	   return $obj['iso_a2'];
	// 	});

	
	header('Content-Type: application/json; charset=UTF-8');
				
	echo json_encode($output);  

?>
