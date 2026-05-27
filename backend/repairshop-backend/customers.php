<?php
require_once __DIR__ . '/api/helpers.php';

$method = parseMethod();
$user = requireAuth();
$conn = getConnection();

function formatCustomer(array $customer): array
{
    return [
        'id' => (int)$customer['id'],
        'fullName' => $customer['full_name'],
        'email' => $customer['email'],
        'role' => $customer['role'],
        'createdAt' => $customer['created_at'],
    ];
}

if ($method === 'GET') {
    $search = sanitizeString($_GET['search'] ?? '');
    $sql = 'SELECT id, full_name, email, role, created_at FROM users WHERE role = ?';
    $params = ['customer'];

    if ($user['role'] !== 'admin') {
        $sql .= ' AND id = ?';
        $params[] = $user['id'];
    }

    if ($search !== '') {
        $sql .= ' AND (full_name LIKE ? OR email LIKE ? OR id = ? OR role LIKE ?)';
        $searchTerm = "%{$search}%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $search;
        $params[] = $searchTerm;
    }

    $sql .= ' ORDER BY created_at DESC';
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    sendResponse(true, 'Customers retrieved.', ['customers' => array_map('formatCustomer', $stmt->fetchAll())]);
}

if ($method === 'POST') {
    requireAuth(['admin']);
    $input = getJsonInput();
    $fullName = sanitizeString($input['fullName'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!$fullName || !$email || !$password) {
        sendResponse(false, 'Full name, email, and password are required.', [], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Please provide a valid email address.', [], 400);
    }

    $stmt = $conn->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(false, 'This email is already registered.', [], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare('INSERT INTO users (full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())');
    $stmt->execute([$fullName, $email, $passwordHash, 'customer']);
    sendResponse(true, 'Customer record created.', ['customer' => formatCustomer(['id' => $conn->lastInsertId(), 'full_name' => $fullName, 'email' => $email, 'role' => 'customer', 'created_at' => date('Y-m-d H:i:s')])], 201);
}

if ($method === 'PUT') {
    requireAuth(['admin']);
    $input = getJsonInput();
    $customerId = isset($input['id']) ? (int)$input['id'] : 0;
    if (!$customerId) {
        sendResponse(false, 'Customer id is required for update.', [], 400);
    }

    $fullName = sanitizeString($input['fullName'] ?? '');
    $email = trim($input['email'] ?? '');

    if (!$fullName || !$email) {
        sendResponse(false, 'Full name and email are required.', [], 400);
    }

    $stmt = $conn->prepare('UPDATE users SET full_name = ?, email = ?, updated_at = NOW() WHERE id = ? AND role = ?');
    $stmt->execute([$fullName, $email, $customerId, 'customer']);
    sendResponse(true, 'Customer record updated.');
}

if ($method === 'DELETE') {
    requireAuth(['admin']);
    $input = getJsonInput();
    $customerId = isset($input['id']) ? (int)$input['id'] : 0;
    if (!$customerId) {
        sendResponse(false, 'Customer id is required for deletion.', [], 400);
    }

    $stmt = $conn->prepare('DELETE FROM users WHERE id = ? AND role = ?');
    $stmt->execute([$customerId, 'customer']);
    sendResponse(true, 'Customer record deleted.');
}

sendResponse(false, 'Method not allowed.', [], 405);
