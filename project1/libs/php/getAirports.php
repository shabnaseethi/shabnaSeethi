<?php
    
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

   
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);


    $url ='https://airlabs.co/api/v9/airports?country_code='.$_REQUEST['country'].'&api_key=16acf298-c207-4a8f-a5d2-45045b7daaad';


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER,[
        'Content-Type: application/json; charset=UTF-8',
        'Access-Control-Allow-Origin:*'

    ]
    );

	$result=curl_exec($ch);
    

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['response'];
  
	
	// header('Content-Type: application/json; charset=UTF-8');
   

	// echo json_encode($output);
    echo $result;
  

?>
