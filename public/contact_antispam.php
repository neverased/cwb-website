<?php

declare(strict_types=1);

const CONTACT_MAX_NAME_LENGTH = 120;
const CONTACT_MAX_EMAIL_LENGTH = 160;
const CONTACT_MAX_SCOPE_LENGTH = 160;
const CONTACT_MAX_MESSAGE_LENGTH = 5000;
const CONTACT_DEFAULT_MIN_AGE_SECONDS = 4;
const CONTACT_DEFAULT_BOOTSTRAP_TTL_SECONDS = 1800;
const CONTACT_DEFAULT_SPAM_THRESHOLD = 5;
const CONTACT_DEFAULT_RATE_LIMIT_MAX_ATTEMPTS = 3;
const CONTACT_DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 600;

function contact_clean_line(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

function contact_compact_whitespace(string $value): string
{
    return trim((string) preg_replace('/\s+/u', ' ', $value));
}

function contact_string_length(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value);
    }

    return strlen($value);
}

function contact_lowercase(string $value): string
{
    if (function_exists('mb_strtolower')) {
        return mb_strtolower($value);
    }

    return strtolower($value);
}

function contact_join_paths(string ...$segments): string
{
    $cleanSegments = [];

    foreach ($segments as $index => $segment) {
        $normalized = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $segment);

        if ($normalized === '') {
            continue;
        }

        $cleanSegments[] = $index === 0
            ? rtrim($normalized, DIRECTORY_SEPARATOR)
            : trim($normalized, DIRECTORY_SEPARATOR);
    }

    return implode(DIRECTORY_SEPARATOR, $cleanSegments);
}

function contact_ensure_directory(string $path): void
{
    if (is_dir($path)) {
        return;
    }

    mkdir($path, 0775, true);
}

function contact_get_storage_dir(array $options = []): string
{
    if (!empty($options['storage_dir'])) {
        return rtrim((string) $options['storage_dir'], DIRECTORY_SEPARATOR);
    }

    $envStorageDir = getenv('CONTACT_STORAGE_DIR');

    if (is_string($envStorageDir) && $envStorageDir !== '') {
        return rtrim($envStorageDir, DIRECTORY_SEPARATOR);
    }

    return contact_join_paths(rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR), 'cwb-contact');
}

function contact_get_signing_secret(array $options = []): string
{
    if (!empty($options['secret'])) {
        return (string) $options['secret'];
    }

    $envSecret = getenv('CONTACT_FORM_SECRET');

    if (is_string($envSecret) && $envSecret !== '') {
        return $envSecret;
    }

    $runtimeDir = contact_join_paths(contact_get_storage_dir($options), 'runtime');
    $secretPath = contact_join_paths($runtimeDir, 'contact-form-secret.txt');

    contact_ensure_directory($runtimeDir);

    if (is_file($secretPath)) {
        $storedSecret = trim((string) file_get_contents($secretPath));

        if ($storedSecret !== '') {
            return $storedSecret;
        }
    }

    $generatedSecret = bin2hex(random_bytes(32));
    file_put_contents($secretPath, $generatedSecret, LOCK_EX);
    @chmod($secretPath, 0600);

    return $generatedSecret;
}

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
    if ($token === '') {
        return false;
    }

    return hash_equals(contact_sign_bootstrap($payload, $secret), $token);
}

function contact_is_submission_too_fast(int $issuedAt, int $submittedAt, int $minAgeSeconds = CONTACT_DEFAULT_MIN_AGE_SECONDS): bool
{
    return ($submittedAt - $issuedAt) < $minAgeSeconds;
}

function contact_is_bootstrap_expired(int $issuedAt, int $submittedAt, int $ttlSeconds = CONTACT_DEFAULT_BOOTSTRAP_TTL_SECONDS): bool
{
    return ($submittedAt - $issuedAt) > $ttlSeconds;
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

    $spamThreshold = (int) ($signals['spam_threshold'] ?? CONTACT_DEFAULT_SPAM_THRESHOLD);

    if (((int) ($signals['spam_score'] ?? 0)) >= $spamThreshold) {
        return 'quarantine';
    }

    return 'accept';
}

function contact_build_bootstrap(array $options = []): array
{
    $now = isset($options['now']) ? (int) $options['now'] : time();
    $challengeFirst = isset($options['challenge_first']) ? (int) $options['challenge_first'] : random_int(1, 9);
    $challengeSecond = isset($options['challenge_second']) ? (int) $options['challenge_second'] : random_int(1, 9);
    $payload = [
        'nonce' => (string) ($options['nonce'] ?? bin2hex(random_bytes(16))),
        'issued_at' => $now,
        'challenge_first' => $challengeFirst,
        'challenge_second' => $challengeSecond,
    ];

    return $payload + [
        'challenge_prompt' => sprintf('What is %d + %d?', $challengeFirst, $challengeSecond),
        'token' => contact_sign_bootstrap($payload, contact_get_signing_secret($options)),
    ];
}

function contact_collect_honeypot_reasons(array $post): array
{
    $reasons = [];

    foreach (['website', 'company', 'full_name_confirm'] as $field) {
        if (trim((string) ($post[$field] ?? '')) !== '') {
            $reasons[] = 'honeypot_' . $field;
        }
    }

    return $reasons;
}

function contact_score_submission_content(string $message): array
{
    $score = 0;
    $reasons = [];

    preg_match_all('~(?:https?://|www\.)\S+~iu', $message, $links);
    $linkCount = count($links[0]);

    if ($linkCount >= 2) {
        $score += 4;
        $reasons[] = 'contains_multiple_links';
    }

    if (preg_match('~\b(backlinks?|guest post|google rankings?|seo|casino|crypto|telegram|whatsapp)\b~iu', $message) === 1) {
        $score += 6;
        $reasons[] = 'suspicious_phrase';
    }

    $symbolCharacters = preg_match_all('/[^a-z0-9\s]/iu', $message, $matches);
    $messageLength = max(contact_string_length($message), 1);

    if (($symbolCharacters / $messageLength) > 0.18) {
        $score += 2;
        $reasons[] = 'high_symbol_density';
    }

    return [
        'score' => $score,
        'reasons' => $reasons,
    ];
}

function contact_rate_limit_file_path(string $storageDir, string $bucket, string $key): string
{
    return contact_join_paths(
        $storageDir,
        'rate-limit',
        $bucket,
        hash('sha256', contact_lowercase($key))
    ) . '.json';
}

function contact_record_rate_limit_event(
    string $storageDir,
    string $bucket,
    string $key,
    int $timestamp,
    int $windowSeconds
): int {
    $normalizedKey = trim($key);

    if ($normalizedKey === '' || $normalizedKey === 'unknown') {
        return 0;
    }

    $filePath = contact_rate_limit_file_path($storageDir, $bucket, $normalizedKey);
    $directory = dirname($filePath);

    contact_ensure_directory($directory);

    $existingTimestamps = [];

    if (is_file($filePath)) {
        $decoded = json_decode((string) file_get_contents($filePath), true);

        if (is_array($decoded)) {
            foreach ($decoded as $candidate) {
                if (is_int($candidate) || ctype_digit((string) $candidate)) {
                    $existingTimestamps[] = (int) $candidate;
                }
            }
        }
    }

    $cutoff = $timestamp - $windowSeconds;
    $freshTimestamps = array_values(array_filter(
        $existingTimestamps,
        static fn (int $candidate): bool => $candidate >= $cutoff
    ));
    $freshTimestamps[] = $timestamp;

    file_put_contents($filePath, json_encode($freshTimestamps, JSON_UNESCAPED_SLASHES), LOCK_EX);

    return count($freshTimestamps);
}

function contact_log_quarantine(string $storageDir, array $record): ?string
{
    $quarantineDir = contact_join_paths($storageDir, 'quarantine');

    contact_ensure_directory($quarantineDir);

    $datePartition = gmdate('Y-m-d', (int) ($record['received_at'] ?? time()));
    $filePath = contact_join_paths($quarantineDir, $datePartition . '.jsonl');
    $encodedRecord = json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($encodedRecord === false) {
        return null;
    }

    $bytesWritten = file_put_contents($filePath, $encodedRecord . PHP_EOL, FILE_APPEND | LOCK_EX);

    if ($bytesWritten === false) {
        return null;
    }

    return $filePath;
}

function contact_unique_reasons(array $reasons): array
{
    return array_values(array_unique($reasons));
}

function contact_evaluate_submission(array $server, array $post, array $options = []): array
{
    $now = isset($options['now']) ? (int) $options['now'] : time();
    $storageDir = contact_get_storage_dir($options);
    $secret = contact_get_signing_secret($options);
    $minAgeSeconds = (int) ($options['min_submission_age_seconds'] ?? CONTACT_DEFAULT_MIN_AGE_SECONDS);
    $bootstrapTtlSeconds = (int) ($options['bootstrap_ttl_seconds'] ?? CONTACT_DEFAULT_BOOTSTRAP_TTL_SECONDS);
    $rateLimitWindowSeconds = (int) ($options['rate_limit_window_seconds'] ?? CONTACT_DEFAULT_RATE_LIMIT_WINDOW_SECONDS);
    $rateLimitMaxAttempts = (int) ($options['rate_limit_max_attempts'] ?? CONTACT_DEFAULT_RATE_LIMIT_MAX_ATTEMPTS);
    $spamThreshold = (int) ($options['spam_threshold'] ?? CONTACT_DEFAULT_SPAM_THRESHOLD);

    $name = contact_compact_whitespace((string) ($post['name'] ?? ''));
    $email = trim((string) ($post['email'] ?? ''));
    $scope = contact_compact_whitespace((string) ($post['scope'] ?? ''));
    $message = trim((string) ($post['message'] ?? ''));
    $challengeAnswer = trim((string) ($post['challenge_answer'] ?? ''));
    $bootstrapPayload = [
        'nonce' => trim((string) ($post['contact_nonce'] ?? '')),
        'issued_at' => (int) ($post['contact_issued_at'] ?? 0),
        'challenge_first' => (int) ($post['challenge_first'] ?? 0),
        'challenge_second' => (int) ($post['challenge_second'] ?? 0),
    ];
    $bootstrapToken = trim((string) ($post['contact_token'] ?? ''));
    $honeypotReasons = contact_collect_honeypot_reasons($post);
    $reasons = $honeypotReasons;
    $spamScore = 0;
    $hasInvalidPayload = false;
    $isRateLimited = false;

    $isValid = $name !== ''
        && $message !== ''
        && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
        && contact_string_length($name) <= CONTACT_MAX_NAME_LENGTH
        && contact_string_length($email) <= CONTACT_MAX_EMAIL_LENGTH
        && contact_string_length($scope) <= CONTACT_MAX_SCOPE_LENGTH
        && contact_string_length($message) <= CONTACT_MAX_MESSAGE_LENGTH;

    if (!$isValid) {
        $hasInvalidPayload = true;
        $reasons[] = 'invalid_contact_fields';
    }

    $hasBootstrapFields = $bootstrapPayload['nonce'] !== ''
        && $bootstrapPayload['issued_at'] > 0
        && $bootstrapToken !== ''
        && $challengeAnswer !== '';

    if (!$hasBootstrapFields) {
        $hasInvalidPayload = true;
        $reasons[] = 'missing_bootstrap_fields';
    }

    if (!$hasInvalidPayload && !contact_verify_bootstrap_token($bootstrapPayload, $bootstrapToken, $secret)) {
        $hasInvalidPayload = true;
        $reasons[] = 'invalid_bootstrap_token';
    }

    if (!$hasInvalidPayload && contact_is_bootstrap_expired($bootstrapPayload['issued_at'], $now, $bootstrapTtlSeconds)) {
        $hasInvalidPayload = true;
        $reasons[] = 'expired_bootstrap_token';
    }

    if (!$hasInvalidPayload && contact_is_submission_too_fast($bootstrapPayload['issued_at'], $now, $minAgeSeconds)) {
        $spamScore += 5;
        $reasons[] = 'submitted_too_fast';
    }

    if (!$hasInvalidPayload && !contact_is_challenge_answer_valid($bootstrapPayload, $challengeAnswer)) {
        $spamScore += 6;
        $reasons[] = 'challenge_failed';
    }

    $contentSignals = contact_score_submission_content($message);
    $spamScore += (int) ($contentSignals['score'] ?? 0);
    $reasons = array_merge($reasons, $contentSignals['reasons'] ?? []);

    $remoteAddress = contact_clean_line((string) ($server['REMOTE_ADDR'] ?? 'unknown'));
    $userAgent = contact_clean_line((string) ($server['HTTP_USER_AGENT'] ?? 'unknown'));

    if (!$hasInvalidPayload) {
        $ipAttempts = contact_record_rate_limit_event(
            $storageDir,
            'ip',
            $remoteAddress,
            $now,
            $rateLimitWindowSeconds
        );

        if ($ipAttempts > $rateLimitMaxAttempts) {
            $isRateLimited = true;
            $reasons[] = 'ip_rate_limited';
        }

        $emailAttempts = contact_record_rate_limit_event(
            $storageDir,
            'email',
            contact_lowercase($email),
            $now,
            $rateLimitWindowSeconds
        );

        if ($emailAttempts > $rateLimitMaxAttempts) {
            $isRateLimited = true;
            $reasons[] = 'email_rate_limited';
        }
    }

    $classification = contact_classify_submission([
        'has_invalid_payload' => $hasInvalidPayload,
        'honeypot_hits' => count($honeypotReasons),
        'is_rate_limited' => $isRateLimited,
        'spam_score' => $spamScore,
        'spam_threshold' => $spamThreshold,
    ]);

    $quarantinePath = null;
    $normalizedReasons = contact_unique_reasons($reasons);

    if ($classification === 'quarantine') {
        $quarantinePath = contact_log_quarantine($storageDir, [
            'received_at' => $now,
            'classification' => $classification,
            'reasons' => $normalizedReasons,
            'spam_score' => $spamScore,
            'name' => $name,
            'email' => $email,
            'scope' => $scope,
            'message' => $message,
            'remote_address' => $remoteAddress,
            'user_agent' => $userAgent,
        ]);
    }

    return [
        'classification' => $classification,
        'reasons' => $normalizedReasons,
        'spam_score' => $spamScore,
        'fields' => [
            'name' => $name,
            'email' => $email,
            'scope' => $scope,
            'message' => $message,
        ],
        'remote_address' => $remoteAddress,
        'user_agent' => $userAgent,
        'quarantine_path' => $quarantinePath,
    ];
}
