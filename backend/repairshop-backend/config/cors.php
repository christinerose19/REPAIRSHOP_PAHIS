<?php
// Cross-origin headers for development between Vite and Apache/PHP backend.
// Vite may move to the next port if 5173 is already in use.
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? '';
if ($requestMethod === 'OPTIONS') {
    http_response_code(204);
    exit;
}
