import {
  createHash,
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

import { extractQuoteContent } from "./presentation";
import type { QuoteContent } from "./types";

export const QUOTE_SESSION_SECONDS = 8 * 60 * 60;
const PASSWORD_MIN = 12;
const PASSWORD_MAX = 256;
const HASH_PATTERN = /^scrypt-v1\$([a-f0-9]{32})\$([a-f0-9]{128})$/;

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

export async function hashQuotePassword(password: string): Promise<string> {
  if (
    typeof password !== "string" ||
    password.length < PASSWORD_MIN ||
    password.length > PASSWORD_MAX
  ) {
    throw new Error(
      `Hasło musi mieć od ${PASSWORD_MIN} do ${PASSWORD_MAX} znaków.`,
    );
  }
  const salt = randomBytes(16).toString("hex");
  return `scrypt-v1$${salt}$${(await derive(password, salt)).toString("hex")}`;
}

export async function verifyQuotePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  if (
    typeof password !== "string" ||
    password.length < PASSWORD_MIN ||
    password.length > PASSWORD_MAX ||
    typeof hash !== "string"
  )
    return false;
  const match = HASH_PATTERN.exec(hash);
  if (!match) return false;
  const key = await derive(password, match[1]);
  return timingSafeEqual(key, Buffer.from(match[2], "hex"));
}

const passwordFingerprint = (hash: string) =>
  createHash("sha256").update(hash).digest("hex");
const signature = (body: string, secret: string) =>
  createHmac("sha256", secret)
    .update(`quote-session-v1.${body}`)
    .digest("base64url");

export function createQuoteSession(
  publicId: string,
  passwordHash: string,
  secret: string,
  nowMs = Date.now(),
): string {
  if (
    !/^[a-f0-9]{32}$/.test(publicId) ||
    !HASH_PATTERN.test(passwordHash) ||
    secret.length < 32 ||
    !Number.isSafeInteger(nowMs)
  )
    throw new Error("Invalid quote session configuration");
  const issuedAt = Math.floor(nowMs / 1000);
  const body = Buffer.from(
    JSON.stringify({
      id: publicId,
      pwd: passwordFingerprint(passwordHash),
      iat: issuedAt,
      exp: issuedAt + QUOTE_SESSION_SECONDS,
    }),
  ).toString("base64url");
  return `${body}.${signature(body, secret)}`;
}

export function verifyQuoteSession(
  token: string,
  publicId: string,
  passwordHash: string,
  secret: string,
  nowMs = Date.now(),
): boolean {
  if (
    typeof token !== "string" ||
    token.length > 1024 ||
    !/^[a-f0-9]{32}$/.test(publicId) ||
    !HASH_PATTERN.test(passwordHash) ||
    secret.length < 32 ||
    !Number.isSafeInteger(nowMs)
  )
    return false;
  const match = /^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return false;
  const [, body, suppliedSignature] = match;
  if (
    !timingSafeEqual(
      Buffer.from(suppliedSignature),
      Buffer.from(signature(body, secret)),
    )
  )
    return false;
  try {
    const session = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    const now = Math.floor(nowMs / 1000);
    return (
      session.id === publicId &&
      session.pwd === passwordFingerprint(passwordHash) &&
      Number.isSafeInteger(session.iat) &&
      Number.isSafeInteger(session.exp) &&
      session.iat <= now &&
      session.exp > now &&
      session.exp - session.iat === QUOTE_SESSION_SECONDS
    );
  } catch {
    return false;
  }
}

/** Normalize the public allowlist so key order and CMS-only metadata cannot change a revision. */
export function quoteRevision(content: QuoteContent): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        extractQuoteContent(content as unknown as Record<string, unknown>),
      ),
    )
    .digest("hex");
}
