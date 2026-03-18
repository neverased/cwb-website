<?php

declare(strict_types=1);

const CONTACT_RECIPIENT = 'mail@wojciechbajer.com';
const CONTACT_FROM = 'mail@wojciechbajer.com';
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_SCOPE_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5000;

function redirect_with_status(string $status): never
{
    header('Location: ./?contact=' . rawurlencode($status) . '#contact', true, 303);
    exit;
}

function clean_line(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

function compact_whitespace(string $value): string
{
    return trim((string) preg_replace('/\s+/u', ' ', $value));
}

function string_length(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value);
    }

    return strlen($value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    redirect_with_status('error');
}

$honeypot = trim((string) ($_POST['website'] ?? ''));

if ($honeypot !== '') {
    redirect_with_status('sent');
}

$name = compact_whitespace((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$scope = compact_whitespace((string) ($_POST['scope'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

$isValid = $name !== ''
    && $message !== ''
    && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
    && string_length($name) <= MAX_NAME_LENGTH
    && string_length($email) <= MAX_EMAIL_LENGTH
    && string_length($scope) <= MAX_SCOPE_LENGTH
    && string_length($message) <= MAX_MESSAGE_LENGTH;

if (!$isValid) {
    redirect_with_status('invalid');
}

$safeName = clean_line($name);
$safeEmail = clean_line($email);
$safeScope = $scope !== '' ? clean_line($scope) : 'not specified';
$safeUserAgent = clean_line((string) ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'));
$safeRemoteAddress = clean_line((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));

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
