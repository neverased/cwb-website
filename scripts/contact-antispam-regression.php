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

$helperPath = __DIR__ . '/../public/contact_antispam.php';

assert_true(file_exists($helperPath), 'Expected contact anti-spam helper file to exist.');

require_once $helperPath;

assert_true(function_exists('contact_sign_bootstrap'), 'Expected contact_sign_bootstrap() to exist.');
assert_true(function_exists('contact_verify_bootstrap_token'), 'Expected contact_verify_bootstrap_token() to exist.');
assert_true(function_exists('contact_is_submission_too_fast'), 'Expected contact_is_submission_too_fast() to exist.');
assert_true(function_exists('contact_is_challenge_answer_valid'), 'Expected contact_is_challenge_answer_valid() to exist.');
assert_true(function_exists('contact_classify_submission'), 'Expected contact_classify_submission() to exist.');

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

fwrite(STDOUT, 'All contact anti-spam regression checks passed.' . PHP_EOL);
