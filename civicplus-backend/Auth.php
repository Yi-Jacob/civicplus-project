<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$clientId = '5b7a474b-3d3a-47f5-902e-92e00f589317';
$clientSecret = 'tcoaccenocraznf8uxkqx5jkqufaysj3wzpkudvznncx';

function getBearerToken() {
    global $clientId, $clientSecret;
    $url = 'https://interview.civicplus.com/5b7a474b-3d3a-47f5-902e-92e00f589317/api/Auth';
    $data = json_encode(['clientId' => $clientId, 'clientSecret' => $clientSecret]);

    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => $data,
        ],
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch bearer token']);
        exit;
    }

    $response = json_decode($result, true);
    return isset($response['access_token']) ? $response['access_token'] : null;
}

$token = getBearerToken();
if ($token) {
    $response = [
        'success' => true,
        'data' => $token
    ];
    echo json_encode($response);
}
?>
