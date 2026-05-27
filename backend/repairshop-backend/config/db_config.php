<?php
// Database configuration for the repair shop backend.
// Update DB_USER and DB_PASS if your local MySQL installation uses different credentials.

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'repairshop_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL', 'http://localhost/repairshop-backend/uploads/');

if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}
