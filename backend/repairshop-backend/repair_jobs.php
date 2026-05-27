<?php
require_once __DIR__ . '/api/helpers.php';

$method = parseMethod();
$user = requireAuth();
$conn = getConnection();

function formatJob(array $job): array
{
    return [
        'id' => (int)$job['id'],
        'jobNumber' => $job['job_number'],
        'userId' => $job['user_id'] !== null ? (int)$job['user_id'] : null,
        'customerCode' => $job['customer_code'],
        'customerName' => $job['customer_name'],
        'model' => $job['model'],
        'problem' => $job['problem'],
        'status' => $job['status'],
        'estimatedCost' => $job['estimated_cost'],
        'imageUrl' => $job['image_url'],
        'createdAt' => $job['created_at'],
        'updatedAt' => $job['updated_at'],
    ];
}

if ($method === 'GET') {
    $search = sanitizeString($_GET['search'] ?? '');
    $where = [];
    $params = [];

    if ($user['role'] !== 'admin') {
        $where[] = 'user_id = ?';
        $params[] = $user['id'];
    }

    if ($search !== '') {
        $where[] = '(job_number LIKE ? OR customer_name LIKE ? OR model LIKE ? OR customer_code LIKE ?)';
        $searchParam = "%{$search}%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
    }

    $sql = 'SELECT * FROM repair_jobs';
    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY created_at DESC';

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $jobs = array_map('formatJob', $stmt->fetchAll());
    sendResponse(true, 'Repair jobs retrieved.', ['jobs' => $jobs]);
}

if ($method === 'POST') {
    $input = getJsonInput();
    $model = sanitizeString($input['model'] ?? '');
    $problem = sanitizeString($input['problem'] ?? '');
    $estimatedCost = sanitizeString($input['estimatedCost'] ?? '');
    $status = sanitizeString($input['status'] ?? 'Pending');
    $customerName = sanitizeString($input['customerName'] ?? $user['fullName']);
    $customerCode = sanitizeString($input['customerCode'] ?? '');
    $imageUrl = sanitizeString($input['imageUrl'] ?? '');

    if (!$model || !$problem) {
        sendResponse(false, 'Model and problem description are required.', [], 400);
    }

    if (!in_array($status, ['Pending', 'In Progress', 'Completed'], true)) {
        $status = 'Pending';
    }

    if ($user['role'] === 'customer') {
        $customerCode = sprintf('C-%03d', $user['id']);
    } elseif (!$customerCode) {
        $customerCode = 'C-000';
    }

    $jobNumber = 'R-' . rand(1000, 9999);
    $stmt = $conn->prepare('INSERT INTO repair_jobs (job_number, user_id, customer_code, customer_name, model, problem, status, estimated_cost, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
    $stmt->execute([
        $jobNumber,
        $user['role'] === 'customer' ? $user['id'] : null,
        $customerCode,
        $customerName,
        $model,
        $problem,
        $status,
        $estimatedCost,
        $imageUrl,
    ]);

    $jobId = (int)$conn->lastInsertId();
    sendResponse(true, 'Repair job created.', ['job' => [
        'id' => $jobId,
        'jobNumber' => $jobNumber,
        'userId' => $user['role'] === 'customer' ? $user['id'] : null,
        'customerCode' => $customerCode,
        'customerName' => $customerName,
        'model' => $model,
        'problem' => $problem,
        'status' => $status,
        'estimatedCost' => $estimatedCost,
        'imageUrl' => $imageUrl,
        'createdAt' => date('Y-m-d H:i:s'),
        'updatedAt' => date('Y-m-d H:i:s'),
    ]]);
}

if ($method === 'PUT') {
    $input = getJsonInput();
    $jobId = isset($input['id']) ? (int)$input['id'] : 0;
    if (!$jobId) {
        sendResponse(false, 'Repair job id is required for update.', [], 400);
    }

    $stmt = $conn->prepare('SELECT * FROM repair_jobs WHERE id = ? LIMIT 1');
    $stmt->execute([$jobId]);
    $job = $stmt->fetch();
    if (!$job) {
        sendResponse(false, 'Repair job not found.', [], 404);
    }

    if ($user['role'] !== 'admin' && (int)$job['user_id'] !== $user['id']) {
        sendResponse(false, 'Permission denied to update this repair job.', [], 403);
    }

    $model = sanitizeString($input['model'] ?? $job['model']);
    $problem = sanitizeString($input['problem'] ?? $job['problem']);
    $estimatedCost = sanitizeString($input['estimatedCost'] ?? $job['estimated_cost']);
    $status = sanitizeString($input['status'] ?? $job['status']);
    $customerName = sanitizeString($input['customerName'] ?? $job['customer_name']);
    $customerCode = sanitizeString($input['customerCode'] ?? $job['customer_code']);
    $imageUrl = sanitizeString($input['imageUrl'] ?? $job['image_url']);

    if (!in_array($status, ['Pending', 'In Progress', 'Completed'], true)) {
        $status = 'Pending';
    }

    $stmt = $conn->prepare('UPDATE repair_jobs SET customer_code = ?, customer_name = ?, model = ?, problem = ?, status = ?, estimated_cost = ?, image_url = ?, updated_at = NOW() WHERE id = ?');
    $stmt->execute([$customerCode, $customerName, $model, $problem, $status, $estimatedCost, $imageUrl, $jobId]);

    sendResponse(true, 'Repair job updated.');
}

if ($method === 'DELETE') {
    $input = getJsonInput();
    $jobId = isset($input['id']) ? (int)$input['id'] : 0;
    if (!$jobId) {
        sendResponse(false, 'Repair job id is required for deletion.', [], 400);
    }

    if ($user['role'] !== 'admin') {
        sendResponse(false, 'Only administrators can delete repair jobs.', [], 403);
    }

    $stmt = $conn->prepare('DELETE FROM repair_jobs WHERE id = ?');
    $stmt->execute([$jobId]);
    sendResponse(true, 'Repair job deleted.');
}

sendResponse(false, 'Method not allowed.', [], 405);
