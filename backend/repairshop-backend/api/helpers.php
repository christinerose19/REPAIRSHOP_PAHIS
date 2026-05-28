<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db_config.php';
require_once __DIR__ . '/../database/connection.php';

function startSession(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

function sendResponse(bool $success, string $message = '', array $data = [], int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
    ]);
    exit;
}

function getJsonInput(): array
{
    $rawBody = file_get_contents('php://input');
    $decoded = json_decode($rawBody, true);
    return is_array($decoded) ? $decoded : [];
}

function requireAuth(array $roles = []): array
{
    startSession();

    if (empty($_SESSION['user']) || !is_array($_SESSION['user'])) {
        sendResponse(false, 'Authentication required', [], 401);
    }

    $user = $_SESSION['user'];

    if (!empty($roles) && !in_array($user['role'], $roles, true)) {
        sendResponse(false, 'Permission denied', [], 403);
    }

    return $user;
}

function sanitizeString($value): string
{
    return trim(filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
}

function parseMethod(): string
{
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'POST' && isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
        $override = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']);
        if (in_array($override, ['PUT', 'DELETE', 'PATCH'], true)) {
            return $override;
        }
    }

    return $method;
}
