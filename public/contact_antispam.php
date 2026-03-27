<?php

declare(strict_types=1);

function contact_bootstrap_signature_payload(array $payload): string
{
    return implode('|', [
        (string) ($payload['nonce'] ?? ''),
        (string) ($payload['issued_at'] ?? ''),
        (string) ($payload['challenge_first'] ?? ''),
        (string) ($payload['challenge_second'] ?? ''),
    ]);
}

function contact_sign_bootstrap(array $payload, string $secret): string
{
    return hash_hmac('sha256', contact_bootstrap_signature_payload($payload), $secret);
}

function contact_verify_bootstrap_token(array $payload, string $token, string $secret): bool
{
    return hash_equals(contact_sign_bootstrap($payload, $secret), $token);
}

function contact_is_submission_too_fast(int $issuedAt, int $submittedAt, int $minAgeSeconds = 4): bool
{
    return ($submittedAt - $issuedAt) < $minAgeSeconds;
}

function contact_is_challenge_answer_valid(array $payload, string $answer): bool
{
    $expectedAnswer = (string) (((int) ($payload['challenge_first'] ?? 0)) + ((int) ($payload['challenge_second'] ?? 0)));

    return trim($answer) === $expectedAnswer;
}

function contact_classify_submission(array $signals): string
{
    if (($signals['has_invalid_payload'] ?? false) === true) {
        return 'reject';
    }

    if (((int) ($signals['honeypot_hits'] ?? 0)) > 0) {
        return 'quarantine';
    }

    if (($signals['is_rate_limited'] ?? false) === true) {
        return 'quarantine';
    }

    if (((int) ($signals['spam_score'] ?? 0)) > 0) {
        return 'quarantine';
    }

    return 'accept';
}
