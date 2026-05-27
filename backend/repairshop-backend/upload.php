<?php
require_once __DIR__ . '/api/helpers.php';
$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Please use POST to upload files.', [], 405);
}

if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    sendResponse(false, 'Please select a valid image file.', [], 400);
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif'];

if (!array_key_exists($file['type'], $allowedTypes)) {
    sendResponse(false, 'Only JPEG, PNG, and GIF files are allowed.', [], 400);
}

if ($file['size'] > 5 * 1024 * 1024) {
    sendResponse(false, 'File size must be 5MB or smaller.', [], 400);
}

$extension = $allowedTypes[$file['type']];
$filename = sprintf('upload_%s.%s', bin2hex(random_bytes(10)), $extension);
$targetPath = UPLOAD_DIR . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    sendResponse(false, 'Unable to save the uploaded file.', [], 500);
}

$imageUrl = UPLOAD_URL . $filename;
sendResponse(true, 'Image uploaded successfully.', ['url' => $imageUrl]);
