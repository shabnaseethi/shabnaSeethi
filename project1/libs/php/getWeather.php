<?php
    
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

   
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);


    // $url ='https://api.openweathermap.org/data/2.5/weather?q='.$_REQUEST['capital'].
    // '&appid=f57b929bbc2d684f15fd9b48e4629b6a';
	$url="http://api.weatherapi.com/v1/forecast.json?key=2c16a4df48884f3e86f143120231002&q=".$_REQUEST['capital']."&days=5&aqi=no&alerts=no";


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
    

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	// $output['data'] = $decode['data'];
	// $output['forecast'] = $decode['forecast'];
  
	
	header('Content-Type: application/json; charset=UTF-8');

	// echo json_encode($output);
    echo $result;
