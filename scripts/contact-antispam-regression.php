<?php

declare(strict_types=1);

function fail(string $message): never
{
    fwrite(STDERR, $message . PHP_EOL);
    exit(1);
}

function assert_true(bool $condition, string $message): void
{
    if (!$condition) {
        fail($message);
    }
}

function assert_false(bool $condition, string $message): void
{
    assert_true(!$condition, $message);
}

function assert_same(mixed $expected, mixed $actual, string $message): void
{
    if ($expected !== $actual) {
        fail($message . ' Expected `' . var_export($expected, true) . '`, got `' . var_export($actual, true) . '`.');
    }
}

function assert_contains(string $needle, array $haystack, string $message): void
{
    if (!in_array($needle, $haystack, true)) {
        fail($message . ' Missing `' . $needle . '` in `' . implode(', ', $haystack) . '`.');
    }
}

function remove_directory(string $path): void
{
    if (!is_dir($path)) {
        return;
    }

    $entries = scandir($path);

    if ($entries === false) {
        return;
    }

    foreach ($entries as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }

        $fullPath = $path . DIRECTORY_SEPARATOR . $entry;

        if (is_dir($fullPath)) {
            remove_directory($fullPath);
            continue;
        }

        unlink($fullPath);
    }

    rmdir($path);
}

function create_storage_dir(string $suffix): string
{
    $path = sys_get_temp_dir() . '/cwb-contact-tests/' . $suffix . '-' . bin2hex(random_bytes(4));

    if (!mkdir($path, 0777, true) && !is_dir($path)) {
        fail('Could not create test storage directory `' . $path . '`.');
    }

    return $path;
}

function build_submission(array $bootstrap, array $overrides = []): array
{
    $submission = [
        'name' => 'Jan Kowalski',
        'email' => 'jan@example.com',
        'scope' => 'architecture',
        'message' => 'Need a systems review for a noisy delivery pipeline.',
        'website' => '',
        'company' => '',
        'full_name_confirm' => '',
        'challenge_answer' => (string) (($bootstrap['challenge_first'] ?? 0) + ($bootstrap['challenge_second'] ?? 0)),
        'contact_nonce' => (string) ($bootstrap['nonce'] ?? ''),
        'contact_issued_at' => (string) ($bootstrap['issued_at'] ?? ''),
        'contact_token' => (string) ($bootstrap['token'] ?? ''),
        'challenge_first' => (string) ($bootstrap['challenge_first'] ?? ''),
        'challenge_second' => (string) ($bootstrap['challenge_second'] ?? ''),
    ];

    return array_merge($submission, $overrides);
}

$helperPath = __DIR__ . '/../public/contact_antispam.php';

assert_true(file_exists($helperPath), 'Expected contact anti-spam helper file to exist.');

require_once $helperPath;

assert_true(function_exists('contact_sign_bootstrap'), 'Expected contact_sign_bootstrap() to exist.');
assert_true(function_exists('contact_verify_bootstrap_token'), 'Expected contact_verify_bootstrap_token() to exist.');
assert_true(function_exists('contact_is_submission_too_fast'), 'Expected contact_is_submission_too_fast() to exist.');
assert_true(function_exists('contact_is_challenge_answer_valid'), 'Expected contact_is_challenge_answer_valid() to exist.');
assert_true(function_exists('contact_classify_submission'), 'Expected contact_classify_submission() to exist.');
assert_true(function_exists('contact_build_bootstrap'), 'Expected contact_build_bootstrap() to exist.');
assert_true(function_exists('contact_evaluate_submission'), 'Expected contact_evaluate_submission() to exist.');

$secret = 'test-secret';
$payload = [
    'nonce' => 'nonce-123',
    'issued_at' => 100,
    'challenge_first' => 3,
    'challenge_second' => 4,
];

$token = contact_sign_bootstrap($payload, $secret);

assert_true(contact_verify_bootstrap_token($payload, $token, $secret), 'Expected signed bootstrap payload to verify.');
assert_false(contact_verify_bootstrap_token($payload, 'bad-token', $secret), 'Expected bad bootstrap token to fail verification.');

assert_true(contact_is_submission_too_fast(100, 102, 4), 'Expected a 2-second submission to count as too fast.');
assert_false(contact_is_submission_too_fast(100, 105, 4), 'Expected a 5-second submission to count as human-paced.');

assert_true(contact_is_challenge_answer_valid($payload, '7'), 'Expected arithmetic challenge answer to match.');
assert_false(contact_is_challenge_answer_valid($payload, '8'), 'Expected wrong arithmetic answer to fail.');

assert_same('quarantine', contact_classify_submission([
    'has_invalid_payload' => false,
    'honeypot_hits' => 1,
    'is_rate_limited' => false,
    'spam_score' => 0,
]), 'Expected honeypot hits to quarantine the submission.');

assert_same('reject', contact_classify_submission([
    'has_invalid_payload' => true,
    'honeypot_hits' => 0,
    'is_rate_limited' => false,
    'spam_score' => 0,
]), 'Expected invalid payloads to reject the submission.');

assert_same('accept', contact_classify_submission([
    'has_invalid_payload' => false,
    'honeypot_hits' => 0,
    'is_rate_limited' => false,
    'spam_score' => 0,
]), 'Expected clean signals to accept the submission.');

$acceptedStorage = create_storage_dir('accept');
$acceptedBootstrap = contact_build_bootstrap([
    'now' => 1_000,
    'secret' => $secret,
    'nonce' => 'nonce-accept',
    'challenge_first' => 2,
    'challenge_second' => 5,
    'storage_dir' => $acceptedStorage,
]);
$acceptedEvaluation = contact_evaluate_submission(
    [
        'REMOTE_ADDR' => '198.51.100.10',
        'HTTP_USER_AGENT' => 'Regression Script',
    ],
    build_submission($acceptedBootstrap),
    [
        'now' => 1_006,
        'secret' => $secret,
        'storage_dir' => $acceptedStorage,
        'rate_limit_max_attempts' => 3,
        'rate_limit_window_seconds' => 60,
    ],
);
assert_same('accept', $acceptedEvaluation['classification'] ?? null, 'Expected a normal submission to be accepted.');

$tooFastStorage = create_storage_dir('too-fast');
$tooFastBootstrap = contact_build_bootstrap([
    'now' => 2_000,
    'secret' => $secret,
    'nonce' => 'nonce-fast',
    'challenge_first' => 4,
    'challenge_second' => 2,
    'storage_dir' => $tooFastStorage,
]);
$tooFastEvaluation = contact_evaluate_submission(
    [
        'REMOTE_ADDR' => '198.51.100.11',
        'HTTP_USER_AGENT' => 'Regression Script',
    ],
    build_submission($tooFastBootstrap),
    [
        'now' => 2_001,
        'secret' => $secret,
        'storage_dir' => $tooFastStorage,
        'rate_limit_max_attempts' => 3,
        'rate_limit_window_seconds' => 60,
    ],
);
assert_same('quarantine', $tooFastEvaluation['classification'] ?? null, 'Expected too-fast submissions to quarantine.');
assert_contains('submitted_too_fast', $tooFastEvaluation['reasons'] ?? [], 'Expected too-fast submission reason to be recorded.');

$honeypotStorage = create_storage_dir('honeypot');
$honeypotBootstrap = contact_build_bootstrap([
    'now' => 3_000,
    'secret' => $secret,
    'nonce' => 'nonce-honeypot',
    'challenge_first' => 1,
    'challenge_second' => 6,
    'storage_dir' => $honeypotStorage,
]);
$honeypotEvaluation = contact_evaluate_submission(
    [
        'REMOTE_ADDR' => '198.51.100.12',
        'HTTP_USER_AGENT' => 'Regression Script',
    ],
    build_submission($honeypotBootstrap, [
        'company' => 'Spam Factory',
    ]),
    [
        'now' => 3_010,
        'secret' => $secret,
        'storage_dir' => $honeypotStorage,
        'rate_limit_max_attempts' => 3,
        'rate_limit_window_seconds' => 60,
    ],
);
assert_same('quarantine', $honeypotEvaluation['classification'] ?? null, 'Expected filled honeypots to quarantine.');
assert_contains('honeypot_company', $honeypotEvaluation['reasons'] ?? [], 'Expected honeypot reason to be recorded.');

$invalidTokenStorage = create_storage_dir('invalid-token');
$invalidTokenBootstrap = contact_build_bootstrap([
    'now' => 4_000,
    'secret' => $secret,
    'nonce' => 'nonce-invalid',
    'challenge_first' => 7,
    'challenge_second' => 1,
    'storage_dir' => $invalidTokenStorage,
]);
$invalidTokenEvaluation = contact_evaluate_submission(
    [
        'REMOTE_ADDR' => '198.51.100.13',
        'HTTP_USER_AGENT' => 'Regression Script',
    ],
    build_submission($invalidTokenBootstrap, [
        'contact_token' => 'tampered-token',
    ]),
    [
        'now' => 4_010,
        'secret' => $secret,
        'storage_dir' => $invalidTokenStorage,
        'rate_limit_max_attempts' => 3,
        'rate_limit_window_seconds' => 60,
    ],
);
assert_same('reject', $invalidTokenEvaluation['classification'] ?? null, 'Expected tampered bootstrap tokens to reject.');
assert_contains('invalid_bootstrap_token', $invalidTokenEvaluation['reasons'] ?? [], 'Expected invalid token reason to be recorded.');

$spamStorage = create_storage_dir('spammy');
$spamBootstrap = contact_build_bootstrap([
    'now' => 5_000,
    'secret' => $secret,
    'nonce' => 'nonce-spam',
    'challenge_first' => 2,
    'challenge_second' => 2,
    'storage_dir' => $spamStorage,
]);
$spamEvaluation = contact_evaluate_submission(
    [
        'REMOTE_ADDR' => '198.51.100.14',
        'HTTP_USER_AGENT' => 'Regression Script',
    ],
    build_submission($spamBootstrap, [
        'message' => 'We can guarantee #1 Google rankings and sell backlinks. Visit https://spam.example and https://seo.example now.',
    ]),
    [
        'now' => 5_020,
        'secret' => $secret,
        'storage_dir' => $spamStorage,
        'rate_limit_max_attempts' => 3,
        'rate_limit_window_seconds' => 60,
    ],
);
assert_same('quarantine', $spamEvaluation['classification'] ?? null, 'Expected spammy content to quarantine.');
assert_contains('suspicious_phrase', $spamEvaluation['reasons'] ?? [], 'Expected spam phrase reason to be recorded.');

$rateLimitStorage = create_storage_dir('rate-limit');

for ($attempt = 1; $attempt <= 4; $attempt++) {
    $bootstrap = contact_build_bootstrap([
        'now' => 6_000 + ($attempt * 10),
        'secret' => $secret,
        'nonce' => 'nonce-rate-' . $attempt,
        'challenge_first' => 3,
        'challenge_second' => 3,
        'storage_dir' => $rateLimitStorage,
    ]);

    $evaluation = contact_evaluate_submission(
        [
            'REMOTE_ADDR' => '198.51.100.15',
            'HTTP_USER_AGENT' => 'Regression Script',
        ],
        build_submission($bootstrap),
        [
            'now' => 6_005 + ($attempt * 10),
            'secret' => $secret,
            'storage_dir' => $rateLimitStorage,
            'rate_limit_max_attempts' => 3,
            'rate_limit_window_seconds' => 600,
        ],
    );

    if ($attempt < 4) {
        assert_same('accept', $evaluation['classification'] ?? null, 'Expected early attempts to stay under the rate limit.');
        continue;
    }

    assert_same('quarantine', $evaluation['classification'] ?? null, 'Expected repeated attempts from one IP to quarantine.');
    assert_contains('ip_rate_limited', $evaluation['reasons'] ?? [], 'Expected IP rate-limit reason to be recorded.');
}

remove_directory($acceptedStorage);
remove_directory($tooFastStorage);
remove_directory($honeypotStorage);
remove_directory($invalidTokenStorage);
remove_directory($spamStorage);
remove_directory($rateLimitStorage);

fwrite(STDOUT, 'All contact anti-spam regression checks passed.' . PHP_EOL);
