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

	$countryBorder;
    for ($i = 0; $i < count($decode['features']); $i++) {
        if($decode['features'][$i]['properties']['iso_a2'] == $_REQUEST['code']){
        $countryBorder = $decode['features'][$i]['geometry'];
        }
    };

	$output['status']['code'] = "200";

    $output['status']['name'] = "ok";

    $output['status']['description'] = "success";

    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    $output['data'] = $countryBorder;

   
    header('Content-Type: application/json; charset=UTF-8');

 

    echo json_encode($output);
  

?>
