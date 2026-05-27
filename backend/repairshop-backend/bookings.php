<?php
require_once __DIR__ . '/api/helpers.php';

$method = parseMethod();
$user = requireAuth();
$conn = getConnection();

function formatBooking(array $booking): array
{
    return [
        'id' => (int)$booking['id'],
        'bookingNumber' => $booking['booking_number'],
        'userId' => $booking['user_id'] !== null ? (int)$booking['user_id'] : null,
        'customerName' => $booking['customer_name'],
        'motorcycleModel' => $booking['motorcycle_model'],
        'serviceType' => $booking['service_type'],
        'description' => $booking['description'],
        'preferredDate' => $booking['preferred_date'],
        'preferredTime' => $booking['preferred_time'],
        'contactNumber' => $booking['contact_number'],
        'status' => $booking['status'],
        'createdAt' => $booking['created_at'],
        'updatedAt' => $booking['updated_at'],
    ];
}

if ($method === 'GET') {
    $search = sanitizeString($_GET['search'] ?? '');
    $sql = 'SELECT * FROM bookings';
    $params = [];

    if ($user['role'] !== 'admin') {
        $sql .= ' WHERE user_id = ?';
        $params[] = $user['id'];
    }

    if ($search !== '') {
        $searchTerm = "%{$search}%";
        if (empty($params)) {
            $sql .= ' WHERE customer_name LIKE ? OR motorcycle_model LIKE ? OR service_type LIKE ? OR booking_number LIKE ?';
        } else {
            $sql .= ' AND (customer_name LIKE ? OR motorcycle_model LIKE ? OR service_type LIKE ? OR booking_number LIKE ?)';
        }
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    }

    $sql .= ' ORDER BY created_at DESC';
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    sendResponse(true, 'Bookings retrieved.', ['bookings' => array_map('formatBooking', $stmt->fetchAll())]);
}

if ($method === 'POST') {
    $input = getJsonInput();
    $customerName = sanitizeString($input['customerName'] ?? $user['fullName']);
    $motorcycleModel = sanitizeString($input['motorcycleModel'] ?? '');
    $serviceType = sanitizeString($input['serviceType'] ?? '');
    $description = sanitizeString($input['description'] ?? '');
    $preferredDate = sanitizeString($input['preferredDate'] ?? '');
    $preferredTime = sanitizeString($input['preferredTime'] ?? '');
    $contactNumber = sanitizeString($input['contactNumber'] ?? '');

    if (!$motorcycleModel || !$serviceType || !$preferredDate || !$contactNumber) {
        sendResponse(false, 'Motorcycle model, service type, preferred date, and contact number are required.', [], 400);
    }

    $status = 'Pending';
    $bookingNumber = 'BK-' . rand(1000, 9999);

    $stmt = $conn->prepare('INSERT INTO bookings (booking_number, user_id, customer_name, motorcycle_model, service_type, description, preferred_date, preferred_time, contact_number, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
    $stmt->execute([
        $bookingNumber,
        $user['role'] === 'customer' ? $user['id'] : null,
        $customerName,
        $motorcycleModel,
        $serviceType,
        $description,
        $preferredDate,
        $preferredTime,
        $contactNumber,
        $status,
    ]);

    sendResponse(true, 'Booking request submitted.', ['booking' => formatBooking([
        'id' => $conn->lastInsertId(),
        'booking_number' => $bookingNumber,
        'user_id' => $user['role'] === 'customer' ? $user['id'] : null,
        'customer_name' => $customerName,
        'motorcycle_model' => $motorcycleModel,
        'service_type' => $serviceType,
        'description' => $description,
        'preferred_date' => $preferredDate,
        'preferred_time' => $preferredTime,
        'contact_number' => $contactNumber,
        'status' => $status,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s'),
    ])], 201);
}

if ($method === 'PUT') {
    $input = getJsonInput();
    $bookingId = isset($input['id']) ? (int)$input['id'] : 0;
    if (!$bookingId) {
        sendResponse(false, 'Booking id is required for update.', [], 400);
    }

    $stmt = $conn->prepare('SELECT * FROM bookings WHERE id = ? LIMIT 1');
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch();
    if (!$booking) {
        sendResponse(false, 'Booking not found.', [], 404);
    }

    if ($user['role'] !== 'admin' && (int)$booking['user_id'] !== $user['id']) {
        sendResponse(false, 'Permission denied to update this booking.', [], 403);
    }

    $status = sanitizeString($input['status'] ?? $booking['status']);
    if (!in_array($status, ['Pending', 'Approved', 'Rejected', 'Cancelled'], true)) {
        $status = $booking['status'];
    }

    $customerName = sanitizeString($input['customerName'] ?? $booking['customer_name']);
    $motorcycleModel = sanitizeString($input['motorcycleModel'] ?? $booking['motorcycle_model']);
    $serviceType = sanitizeString($input['serviceType'] ?? $booking['service_type']);
    $description = sanitizeString($input['description'] ?? $booking['description']);
    $preferredDate = sanitizeString($input['preferredDate'] ?? $booking['preferred_date']);
    $preferredTime = sanitizeString($input['preferredTime'] ?? $booking['preferred_time']);
    $contactNumber = sanitizeString($input['contactNumber'] ?? $booking['contact_number']);

    $stmt = $conn->prepare('UPDATE bookings SET customer_name = ?, motorcycle_model = ?, service_type = ?, description = ?, preferred_date = ?, preferred_time = ?, contact_number = ?, status = ?, updated_at = NOW() WHERE id = ?');
    $stmt->execute([$customerName, $motorcycleModel, $serviceType, $description, $preferredDate, $preferredTime, $contactNumber, $status, $bookingId]);

    sendResponse(true, 'Booking updated.');
}

if ($method === 'DELETE') {
    $input = getJsonInput();
    $bookingId = isset($input['id']) ? (int)$input['id'] : 0;
    if (!$bookingId) {
        sendResponse(false, 'Booking id is required for deletion.', [], 400);
    }

    $stmt = $conn->prepare('SELECT * FROM bookings WHERE id = ? LIMIT 1');
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch();
    if (!$booking) {
        sendResponse(false, 'Booking not found.', [], 404);
    }

    if ($user['role'] !== 'admin' && (int)$booking['user_id'] !== $user['id']) {
        sendResponse(false, 'Permission denied to delete this booking.', [], 403);
    }

    $stmt = $conn->prepare('DELETE FROM bookings WHERE id = ?');
    $stmt->execute([$bookingId]);
    sendResponse(true, 'Booking deleted.');
}

sendResponse(false, 'Method not allowed.', [], 405);
