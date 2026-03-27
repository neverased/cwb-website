<?php

declare(strict_types=1);

require_once __DIR__ . '/contact_antispam.php';

const CONTACT_RECIPIENT = 'mail@wojciechbajer.com';
const CONTACT_FROM = 'mail@wojciechbajer.com';

function redirect_with_status(string $status): never
{
    header('Location: ./?contact=' . rawurlencode($status) . '#contact', true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    redirect_with_status('error');
}

try {
    $evaluation = contact_evaluate_submission($_SERVER, $_POST);
} catch (Throwable $throwable) {
    redirect_with_status('error');
}

if (($evaluation['classification'] ?? 'reject') === 'reject') {
    redirect_with_status('invalid');
}

if (($evaluation['classification'] ?? null) === 'quarantine') {
    redirect_with_status('sent');
}

$fields = $evaluation['fields'] ?? [];
$safeName = contact_clean_line((string) ($fields['name'] ?? ''));
$safeEmail = contact_clean_line((string) ($fields['email'] ?? ''));
$scope = (string) ($fields['scope'] ?? '');
$message = (string) ($fields['message'] ?? '');
$safeScope = $scope !== '' ? contact_clean_line($scope) : 'not specified';
$safeUserAgent = contact_clean_line((string) ($evaluation['user_agent'] ?? 'unknown'));
$safeRemoteAddress = contact_clean_line((string) ($evaluation['remote_address'] ?? 'unknown'));

$body = implode(PHP_EOL . PHP_EOL, [
    'New contact form message from wojciechbajer.com',
    'Name: ' . $safeName,
    'Email: ' . $safeEmail,
    'Scope: ' . $safeScope,
    'Message:' . PHP_EOL . $message,
    'Remote address: ' . $safeRemoteAddress,
    'User agent: ' . $safeUserAgent,
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Wojciech Bajer Website <' . CONTACT_FROM . '>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$isSent = mail(
    CONTACT_RECIPIENT,
    '[wojciechbajer.com] New contact inquiry',
    $body,
    implode("\r\n", $headers)
);

redirect_with_status($isSent ? 'sent' : 'error');
