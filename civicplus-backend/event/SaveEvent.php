<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

function getBearerToken() {
    $headers = null;

    if (function_exists('getallheaders')) {
        $headers = getallheaders();
    } elseif (isset($_SERVER['Authorization'])) { 
        $headers['Authorization'] = $_SERVER['Authorization'];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) { 
        $headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if ($headers && isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }

    return null;
}

function callApi() {
    $bearerToken = getBearerToken();
    if (!$bearerToken || $bearerToken === 'null' || $bearerToken === '') {
        echo json_encode(['error' => '401']);
        return;
    }

    $rawInput = file_get_contents('php://input');
    $eventData = json_decode($rawInput, true);

    if (!$eventData) {
        echo json_encode(['error' => '404']);
        return;
    }

    $url = "https://interview.civicplus.com/707e3553-aa6f-4299-b8d4-a1f2e99bce6a/api/Events";

    $options = [
        'http' => [
            'header'  => "Authorization: Bearer " . $bearerToken . "\r\n" .
                         "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($eventData),
        ],
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        http_response_code(500);
        echo json_encode(['error' => '500']);
        return;
    }
    $response = [
        'success' => true,
        'data' => json_decode($result, true)
    ];
    echo json_encode($response);
}

callApi();

?>
