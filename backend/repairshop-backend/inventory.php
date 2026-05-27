<?php
require_once __DIR__ . '/api/helpers.php';

$method = parseMethod();
$user = requireAuth();
$conn = getConnection();

function formatInventory(array $item): array
{
    return [
        'id' => (int)$item['id'],
        'itemCode' => $item['item_code'],
        'name' => $item['name'],
        'category' => $item['category'],
        'quantity' => (int)$item['quantity'],
        'price' => number_format((float)$item['price'], 2, '.', ''),
        'status' => $item['status'],
    ];
}

if ($method === 'GET') {
    $search = sanitizeString($_GET['search'] ?? '');
    $sql = 'SELECT * FROM inventory';
    $params = [];

    if ($search !== '') {
        $sql .= ' WHERE name LIKE ? OR category LIKE ? OR item_code LIKE ?';
        $searchParam = "%{$search}%";
        $params = [$searchParam, $searchParam, $searchParam];
    }

    $sql .= ' ORDER BY name ASC';
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    sendResponse(true, 'Inventory retrieved.', ['inventory' => array_map('formatInventory', $stmt->fetchAll())]);
}

if ($method === 'POST') {
    requireAuth(['admin']);
    $input = getJsonInput();
    $name = sanitizeString($input['name'] ?? '');
    $category = sanitizeString($input['category'] ?? '');
    $quantity = isset($input['quantity']) ? (int)$input['quantity'] : 0;
    $price = is_numeric($input['price'] ?? '') ? (float)$input['price'] : 0.00;

    if (!$name || !$category) {
        sendResponse(false, 'Item name and category are required.', [], 400);
    }

    $status = $quantity <= 10 ? 'Low Stock' : 'In Stock';
    $itemCode = 'INV-' . str_pad(mt_rand(1, 999), 3, '0', STR_PAD_LEFT);

    $stmt = $conn->prepare('INSERT INTO inventory (item_code, name, category, quantity, price, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())');
    $stmt->execute([$itemCode, $name, $category, $quantity, $price, $status]);

    sendResponse(true, 'Inventory item created.', ['item' => formatInventory(['id' => $conn->lastInsertId(), 'item_code' => $itemCode, 'name' => $name, 'category' => $category, 'quantity' => $quantity, 'price' => $price, 'status' => $status])], 201);
}

if ($method === 'PUT') {
    requireAuth(['admin']);
    $input = getJsonInput();
    $itemId = isset($input['id']) ? (int)$input['id'] : 0;
    if (!$itemId) {
        sendResponse(false, 'Inventory item id is required for update.', [], 400);
    }

    $name = sanitizeString($input['name'] ?? '');
    $category = sanitizeString($input['category'] ?? '');
    $quantity = isset($input['quantity']) ? (int)$input['quantity'] : 0;
    $price = is_numeric($input['price'] ?? '') ? (float)$input['price'] : 0.00;
    $status = $quantity <= 10 ? 'Low Stock' : 'In Stock';

    $stmt = $conn->prepare('UPDATE inventory SET name = ?, category = ?, quantity = ?, price = ?, status = ?, updated_at = NOW() WHERE id = ?');
    $stmt->execute([$name, $category, $quantity, $price, $status, $itemId]);

    sendResponse(true, 'Inventory item updated.');
}

if ($method === 'DELETE') {
    requireAuth(['admin']);
    $input = getJsonInput();
    $itemId = isset($input['id']) ? (int)$input['id'] : 0;
    if (!$itemId) {
        sendResponse(false, 'Inventory item id is required for deletion.', [], 400);
    }

    $stmt = $conn->prepare('DELETE FROM inventory WHERE id = ?');
    $stmt->execute([$itemId]);

    sendResponse(true, 'Inventory item deleted.');
}

sendResponse(false, 'Method not allowed.', [], 405);
