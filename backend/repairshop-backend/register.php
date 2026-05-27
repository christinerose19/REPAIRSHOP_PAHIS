<?php
require_once __DIR__ . '/api/helpers.php';
startSession();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Please use POST method for registration.', [], 405);
}

$data = getJsonInput();
$fullName = sanitizeString($data['fullName'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$fullName || !$email || !$password) {
    sendResponse(false, 'Full name, email, and password are required.', [], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Please provide a valid email address.', [], 400);
}

if (strlen($password) < 6) {
    sendResponse(false, 'Password must be at least 6 characters long.', [], 400);
}

$conn = getConnection();
$stmt = $conn->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    sendResponse(false, 'This email is already registered.', [], 409);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare('INSERT INTO users (full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())');
$stmt->execute([$fullName, $email, $passwordHash, 'customer']);

$userId = (int)$conn->lastInsertId();

sendResponse(true, 'Registration successful.', ['user' => [
    'id' => $userId,
    'fullName' => $fullName,
    'email' => $email,
    'role' => 'customer',
]] , 201);
