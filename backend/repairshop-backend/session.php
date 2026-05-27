<?php
require_once __DIR__ . '/api/helpers.php';
startSession();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, 'Session endpoint accepts GET only.', [], 405);
}

if (empty($_SESSION['user']) || !is_array($_SESSION['user'])) {
    sendResponse(false, 'No active session.', [], 401);
}

sendResponse(true, 'Session active.', ['user' => $_SESSION['user']]);
