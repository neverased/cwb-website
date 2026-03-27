<?php

declare(strict_types=1);

require_once __DIR__ . '/contact_antispam.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'error' => 'method_not_allowed',
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    echo json_encode(contact_build_bootstrap(), JSON_UNESCAPED_SLASHES);
} catch (Throwable $throwable) {
    http_response_code(500);
    echo json_encode([
        'error' => 'bootstrap_unavailable',
    ], JSON_UNESCAPED_SLASHES);
}
