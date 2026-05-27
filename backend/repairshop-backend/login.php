<?php
require_once __DIR__ . '/api/helpers.php';
startSession();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Please use POST method for login.', [], 405);
}

$data = getJsonInput();
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    sendResponse(false, 'Email and password are required.', [], 400);
}

$conn = getConnection();
$stmt = $conn->prepare('SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    sendResponse(false, 'Invalid email or password.', [], 401);
}

$sessionUser = [
    'id' => (int)$user['id'],
    'fullName' => $user['full_name'],
    'email' => $user['email'],
    'role' => $user['role'],
];

$_SESSION['user'] = $sessionUser;

sendResponse(true, 'Login successful.', ['user' => $sessionUser]);
