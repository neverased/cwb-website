import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import { appendFile, chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export const CONTACT_MAX_NAME_LENGTH = 120;
export const CONTACT_MAX_EMAIL_LENGTH = 160;
export const CONTACT_MAX_SCOPE_LENGTH = 160;
export const CONTACT_MAX_MESSAGE_LENGTH = 5000;
export const CONTACT_DEFAULT_MIN_AGE_SECONDS = 4;
export const CONTACT_DEFAULT_BOOTSTRAP_TTL_SECONDS = 1800;
export const CONTACT_DEFAULT_SPAM_THRESHOLD = 5;
export const CONTACT_DEFAULT_RATE_LIMIT_MAX_ATTEMPTS = 3;
export const CONTACT_DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 600;

export interface ContactBootstrap {
  nonce: string;
  issued_at: number;
  challenge_first: number;
  challenge_second: number;
  challenge_prompt: string;
  token: string;
}

interface ContactBootstrapPayload {
  nonce: string;
  issued_at: number;
  challenge_first: number;
  challenge_second: number;
}

interface ContactPolicyOptions {
  now?: number;
  challenge_first?: number;
  challenge_second?: number;
  nonce?: string;
  secret?: string;
  storage_dir?: string;
  min_submission_age_seconds?: number;
  bootstrap_ttl_seconds?: number;
  rate_limit_window_seconds?: number;
  rate_limit_max_attempts?: number;
  spam_threshold?: number;
}

export type ContactClassification = "accept" | "quarantine" | "reject";

export interface ContactEvaluation {
  classification: ContactClassification;
  reasons: string[];
  spam_score: number;
  fields: {
    name: string;
    email: string;
    scope: string;
    message: string;
  };
  remote_address: string;
  user_agent: string;
  quarantine_path: string | null;
}

export interface ContactServerInput {
  remoteAddress?: string;
  userAgent?: string;
}

export interface ContactPostInput {
  [key: string]: string | undefined;
}

const CONTACT_HONEYPOT_FIELDS = [
  "website",
  "company",
  "full_name_confirm",
] as const;

const parseIntegerEnv = (name: string, fallback: number) => {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const cleanLine = (value: string) => value.replace(/[\r\n]/g, " ").trim();

const compactWhitespace = (value: string) => value.replace(/\s+/gu, " ").trim();

const stringLength = (value: string) => Array.from(value).length;

const getContactStorageDir = (options: ContactPolicyOptions = {}) => {
  if (options.storage_dir) {
    return options.storage_dir;
  }

  if (process.env.CONTACT_STORAGE_DIR) {
    return process.env.CONTACT_STORAGE_DIR;
  }

  return path.join(tmpdir(), "cwb-contact");
};

const ensureDirectory = async (directory: string) => {
  await mkdir(directory, {
    recursive: true,
    mode: 0o775,
  });
};

const getSigningSecret = async (options: ContactPolicyOptions = {}) => {
  if (options.secret) {
    return options.secret;
  }

  if (process.env.CONTACT_FORM_SECRET) {
    return process.env.CONTACT_FORM_SECRET;
  }

  const runtimeDir = path.join(getContactStorageDir(options), "runtime");
  const secretPath = path.join(runtimeDir, "contact-form-secret.txt");

  await ensureDirectory(runtimeDir);

  try {
    const storedSecret = (await readFile(secretPath, "utf8")).trim();

    if (storedSecret) {
      return storedSecret;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const generatedSecret = randomBytes(32).toString("hex");
  await writeFile(secretPath, generatedSecret, {
    mode: 0o600,
  });

  try {
    await chmod(secretPath, 0o600);
  } catch {
    // Best effort only; some filesystems ignore chmod.
  }

  return generatedSecret;
};

const bootstrapSignaturePayload = (payload: ContactBootstrapPayload) => {
  return [
    payload.nonce,
    payload.issued_at,
    payload.challenge_first,
    payload.challenge_second,
  ].join("|");
};

const signBootstrap = (payload: ContactBootstrapPayload, secret: string) => {
  return createHmac("sha256", secret)
    .update(bootstrapSignaturePayload(payload))
    .digest("hex");
};

const verifyBootstrapToken = (
  payload: ContactBootstrapPayload,
  token: string,
  secret: string,
) => {
  if (!token) {
    return false;
  }

  const expected = signBootstrap(payload, secret);
  const expectedBuffer = Buffer.from(expected, "hex");
  const tokenBuffer = Buffer.from(token, "hex");

  return (
    expectedBuffer.length === tokenBuffer.length &&
    timingSafeEqual(expectedBuffer, tokenBuffer)
  );
};

const isSubmissionTooFast = (
  issuedAt: number,
  submittedAt: number,
  minAgeSeconds = CONTACT_DEFAULT_MIN_AGE_SECONDS,
) => submittedAt - issuedAt < minAgeSeconds;

const isBootstrapExpired = (
  issuedAt: number,
  submittedAt: number,
  ttlSeconds = CONTACT_DEFAULT_BOOTSTRAP_TTL_SECONDS,
) => submittedAt - issuedAt > ttlSeconds;

const isChallengeAnswerValid = (
  payload: ContactBootstrapPayload,
  answer: string,
) => {
  const expectedAnswer = String(
    payload.challenge_first + payload.challenge_second,
  );

  return answer.trim() === expectedAnswer;
};

export const classifyContactSubmission = ({
  has_invalid_payload = false,
  honeypot_hits = 0,
  is_rate_limited = false,
  spam_score = 0,
  spam_threshold = CONTACT_DEFAULT_SPAM_THRESHOLD,
}: {
  has_invalid_payload?: boolean;
  honeypot_hits?: number;
  is_rate_limited?: boolean;
  spam_score?: number;
  spam_threshold?: number;
}): ContactClassification => {
  if (has_invalid_payload) {
    return "reject";
  }

  if (honeypot_hits > 0 || is_rate_limited || spam_score >= spam_threshold) {
    return "quarantine";
  }

  return "accept";
};

export const buildContactBootstrap = async (
  options: ContactPolicyOptions = {},
): Promise<ContactBootstrap> => {
  const now = options.now ?? Math.floor(Date.now() / 1000);
  const challengeFirst = options.challenge_first ?? randomInt(1, 10);
  const challengeSecond = options.challenge_second ?? randomInt(1, 10);
  const payload = {
    nonce: options.nonce ?? randomBytes(16).toString("hex"),
    issued_at: now,
    challenge_first: challengeFirst,
    challenge_second: challengeSecond,
  };
  const token = signBootstrap(payload, await getSigningSecret(options));

  return {
    ...payload,
    challenge_prompt: `What is ${challengeFirst} + ${challengeSecond}?`,
    token,
  };
};

const collectHoneypotReasons = (post: ContactPostInput) => {
  return CONTACT_HONEYPOT_FIELDS.flatMap((field) =>
    (post[field] ?? "").trim() ? [`honeypot_${field}`] : [],
  );
};

export const scoreContactSubmissionContent = (message: string) => {
  const reasons: string[] = [];
  let score = 0;
  const linkCount = message.match(/(?:https?:\/\/|www\.)\S+/giu)?.length ?? 0;

  if (linkCount >= 2) {
    score += 4;
    reasons.push("contains_multiple_links");
  }

  if (
    /\b(backlinks?|guest post|google rankings?|seo|casino|crypto|telegram|whatsapp)\b/iu.test(
      message,
    )
  ) {
    score += 6;
    reasons.push("suspicious_phrase");
  }

  const symbolCharacters = message.match(/[^a-z0-9\s]/giu)?.length ?? 0;
  const messageLength = Math.max(stringLength(message), 1);

  if (symbolCharacters / messageLength > 0.18) {
    score += 2;
    reasons.push("high_symbol_density");
  }

  return {
    score,
    reasons,
  };
};

const rateLimitFilePath = (storageDir: string, bucket: string, key: string) => {
  const hashedKey = createHash("sha256").update(key.toLowerCase()).digest("hex");

  return path.join(storageDir, "rate-limit", bucket, `${hashedKey}.json`);
};

const recordRateLimitEvent = async (
  storageDir: string,
  bucket: string,
  key: string,
  timestamp: number,
  windowSeconds: number,
) => {
  const normalizedKey = key.trim();

  if (!normalizedKey || normalizedKey === "unknown") {
    return 0;
  }

  const filePath = rateLimitFilePath(storageDir, bucket, normalizedKey);
  await ensureDirectory(path.dirname(filePath));

  let existingTimestamps: number[] = [];

  try {
    const decoded: unknown = JSON.parse(await readFile(filePath, "utf8"));

    if (Array.isArray(decoded)) {
      existingTimestamps = decoded
        .map((candidate) =>
          typeof candidate === "number" || /^\d+$/.test(String(candidate))
            ? Number(candidate)
            : Number.NaN,
        )
        .filter(Number.isFinite);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const cutoff = timestamp - windowSeconds;
  const freshTimestamps = existingTimestamps.filter(
    (candidate) => candidate >= cutoff,
  );
  freshTimestamps.push(timestamp);

  await writeFile(filePath, JSON.stringify(freshTimestamps), "utf8");

  return freshTimestamps.length;
};

const logQuarantine = async (
  storageDir: string,
  record: Record<string, unknown>,
) => {
  const quarantineDir = path.join(storageDir, "quarantine");
  await ensureDirectory(quarantineDir);

  const receivedAt = Number(record.received_at ?? Math.floor(Date.now() / 1000));
  const datePartition = new Date(receivedAt * 1000).toISOString().slice(0, 10);
  const filePath = path.join(quarantineDir, `${datePartition}.jsonl`);

  await appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");

  return filePath;
};

const uniqueReasons = (reasons: string[]) => Array.from(new Set(reasons));

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const evaluateContactSubmission = async (
  server: ContactServerInput,
  post: ContactPostInput,
  options: ContactPolicyOptions = {},
): Promise<ContactEvaluation> => {
  const now = options.now ?? Math.floor(Date.now() / 1000);
  const storageDir = getContactStorageDir(options);
  const secret = await getSigningSecret(options);
  const minAgeSeconds =
    options.min_submission_age_seconds ??
    parseIntegerEnv(
      "CONTACT_MIN_SUBMISSION_AGE_SECONDS",
      CONTACT_DEFAULT_MIN_AGE_SECONDS,
    );
  const bootstrapTtlSeconds =
    options.bootstrap_ttl_seconds ??
    parseIntegerEnv(
      "CONTACT_BOOTSTRAP_TTL_SECONDS",
      CONTACT_DEFAULT_BOOTSTRAP_TTL_SECONDS,
    );
  const rateLimitWindowSeconds =
    options.rate_limit_window_seconds ??
    parseIntegerEnv(
      "CONTACT_RATE_LIMIT_WINDOW_SECONDS",
      CONTACT_DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
    );
  const rateLimitMaxAttempts =
    options.rate_limit_max_attempts ??
    parseIntegerEnv(
      "CONTACT_RATE_LIMIT_MAX_ATTEMPTS",
      CONTACT_DEFAULT_RATE_LIMIT_MAX_ATTEMPTS,
    );
  const spamThreshold =
    options.spam_threshold ??
    parseIntegerEnv("CONTACT_SPAM_THRESHOLD", CONTACT_DEFAULT_SPAM_THRESHOLD);

  const name = compactWhitespace(post.name ?? "");
  const email = (post.email ?? "").trim();
  const scope = compactWhitespace(post.scope ?? "");
  const message = (post.message ?? "").trim();
  const challengeAnswer = (post.challenge_answer ?? "").trim();
  const bootstrapPayload = {
    nonce: (post.contact_nonce ?? "").trim(),
    issued_at: Number(post.contact_issued_at ?? 0),
    challenge_first: Number(post.challenge_first ?? 0),
    challenge_second: Number(post.challenge_second ?? 0),
  };
  const bootstrapToken = (post.contact_token ?? "").trim();
  const honeypotReasons = collectHoneypotReasons(post);
  const reasons = [...honeypotReasons];
  let spamScore = 0;
  let hasInvalidPayload = false;
  let isRateLimited = false;

  const isValid =
    name !== "" &&
    message !== "" &&
    isEmailValid(email) &&
    stringLength(name) <= CONTACT_MAX_NAME_LENGTH &&
    stringLength(email) <= CONTACT_MAX_EMAIL_LENGTH &&
    stringLength(scope) <= CONTACT_MAX_SCOPE_LENGTH &&
    stringLength(message) <= CONTACT_MAX_MESSAGE_LENGTH;

  if (!isValid) {
    hasInvalidPayload = true;
    reasons.push("invalid_contact_fields");
  }

  const hasBootstrapFields =
    bootstrapPayload.nonce !== "" &&
    bootstrapPayload.issued_at > 0 &&
    bootstrapToken !== "" &&
    challengeAnswer !== "";

  if (!hasBootstrapFields) {
    hasInvalidPayload = true;
    reasons.push("missing_bootstrap_fields");
  }

  if (
    !hasInvalidPayload &&
    !verifyBootstrapToken(bootstrapPayload, bootstrapToken, secret)
  ) {
    hasInvalidPayload = true;
    reasons.push("invalid_bootstrap_token");
  }

  if (
    !hasInvalidPayload &&
    isBootstrapExpired(bootstrapPayload.issued_at, now, bootstrapTtlSeconds)
  ) {
    hasInvalidPayload = true;
    reasons.push("expired_bootstrap_token");
  }

  if (
    !hasInvalidPayload &&
    isSubmissionTooFast(bootstrapPayload.issued_at, now, minAgeSeconds)
  ) {
    spamScore += 5;
    reasons.push("submitted_too_fast");
  }

  if (
    !hasInvalidPayload &&
    !isChallengeAnswerValid(bootstrapPayload, challengeAnswer)
  ) {
    spamScore += 6;
    reasons.push("challenge_failed");
  }

  const contentSignals = scoreContactSubmissionContent(message);
  spamScore += contentSignals.score;
  reasons.push(...contentSignals.reasons);

  const remoteAddress = cleanLine(server.remoteAddress ?? "unknown");
  const userAgent = cleanLine(server.userAgent ?? "unknown");

  if (!hasInvalidPayload) {
    const ipAttempts = await recordRateLimitEvent(
      storageDir,
      "ip",
      remoteAddress,
      now,
      rateLimitWindowSeconds,
    );

    if (ipAttempts > rateLimitMaxAttempts) {
      isRateLimited = true;
      reasons.push("ip_rate_limited");
    }

    const emailAttempts = await recordRateLimitEvent(
      storageDir,
      "email",
      email.toLowerCase(),
      now,
      rateLimitWindowSeconds,
    );

    if (emailAttempts > rateLimitMaxAttempts) {
      isRateLimited = true;
      reasons.push("email_rate_limited");
    }
  }

  const classification = classifyContactSubmission({
    has_invalid_payload: hasInvalidPayload,
    honeypot_hits: honeypotReasons.length,
    is_rate_limited: isRateLimited,
    spam_score: spamScore,
    spam_threshold: spamThreshold,
  });
  const normalizedReasons = uniqueReasons(reasons);
  const quarantinePath =
    classification === "quarantine"
      ? await logQuarantine(storageDir, {
          received_at: now,
          classification,
          reasons: normalizedReasons,
          spam_score: spamScore,
          name,
          email,
          scope,
          message,
          remote_address: remoteAddress,
          user_agent: userAgent,
        })
      : null;

  return {
    classification,
    reasons: normalizedReasons,
    spam_score: spamScore,
    fields: {
      name,
      email,
      scope,
      message,
    },
    remote_address: remoteAddress,
    user_agent: userAgent,
    quarantine_path: quarantinePath,
  };
};
