import config from "@payload-config";
import { cookies, headers } from "next/headers";
import { getPayload } from "payload";

import { calculateQuote } from "./calculations";
import { quoteRevision, verifyQuoteSession } from "./credentials";
import { extractQuoteContent } from "./presentation";
import type { PublicQuote, QuoteAcceptance, QuoteSelection } from "./types";

export const QUOTE_PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
} as const;

export const quoteCookieName = (publicId: string) => `cwb_quote_${publicId}`;
export const validPublicId = (value: string) => /^[a-f0-9]{32}$/.test(value);

export function quoteSecret(): string {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Quote signing is not configured");
  return secret;
}

export async function getQuoteRecord(publicId: string, draft = false) {
  if (!validPublicId(publicId)) return null;
  const payload = await getPayload({ config });
  // Explicit privileged read at the security boundary. No result leaves this
  // module until the per-document grant (or staff preview) has been verified.
  const result = await payload.find({
    collection: "quotes",
    where: { publicId: { equals: publicId } },
    limit: 1,
    depth: 0,
    draft,
    overrideAccess: true,
    showHiddenFields: true,
  });
  return result.docs[0] ?? null;
}

type QuoteRecord = NonNullable<Awaited<ReturnType<typeof getQuoteRecord>>>;

export function quoteIsAvailable(
  quote: QuoteRecord,
  now = Date.now(),
): boolean {
  return (
    quote._status === "published" &&
    quote.accessEnabled === true &&
    Boolean(quote.passwordHash) &&
    (!quote.accessExpiresAt || Date.parse(quote.accessExpiresAt) > now)
  );
}

function toPublicQuote(quote: QuoteRecord, preview = false): PublicQuote {
  const content = extractQuoteContent(
    quote as unknown as Record<string, unknown>,
  );
  const revision = preview ? quoteRevision(content) : quote.revision;
  if (!quote.publicId || !revision)
    throw new Error("Quote is not ready for sharing");
  // Neither arbitrary JSON fields nor credentials are spread into client props.
  return {
    ...content,
    publicId: quote.publicId,
    revision,
    allowAcceptance: !preview && quote.allowAcceptance === true,
    acceptance: (quote.acceptance as unknown as QuoteAcceptance) || null,
    ...(preview ? { preview: true } : {}),
  };
}

async function isStaffPreview(): Promise<boolean> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  return user?.collection === "users";
}

export async function getAuthorizedQuote(publicId: string, preview = false) {
  const staff = preview && (await isStaffPreview());
  const record = await getQuoteRecord(publicId, staff);
  if (!record) return null;
  if (staff) return { record, quote: toPublicQuote(record, true) };
  if (!quoteIsAvailable(record)) return null;
  const token = (await cookies()).get(quoteCookieName(publicId))?.value;
  if (
    !token ||
    !verifyQuoteSession(token, publicId, record.passwordHash!, quoteSecret())
  )
    return null;
  return { record, quote: toPublicQuote(record) };
}

export async function getQuotePage(
  publicId: string,
  preview = false,
): Promise<
  | { kind: "unavailable" }
  | { kind: "locked" }
  | { kind: "incomplete" }
  | { kind: "open"; quote: PublicQuote }
> {
  const authorized = await getAuthorizedQuote(publicId, preview);
  if (authorized) {
    if (authorized.quote.preview) {
      try {
        if (!authorized.quote.packages.length) return { kind: "incomplete" };
        for (const pkg of authorized.quote.packages) {
          calculateQuote(authorized.quote, {
            packageId: pkg.id,
            addonIds: authorized.quote.addons.map((addon) => addon.id),
          });
        }
        if (
          !Number.isFinite(Date.parse(authorized.quote.validUntil)) ||
          !Number.isFinite(Date.parse(authorized.quote.issuedAt))
        )
          return { kind: "incomplete" };
      } catch {
        return { kind: "incomplete" };
      }
    }
    return { kind: "open", quote: authorized.quote };
  }
  const record = await getQuoteRecord(publicId);
  return record && quoteIsAvailable(record)
    ? { kind: "locked" }
    : { kind: "unavailable" };
}

/** An atomic, durable limit. Keys are global or known quote IDs, never IPs. */
export async function consumeQuoteAttempt(key: string, maximum: number) {
  const payload = await getPayload({ config });
  const result = await payload.db.pool.query<{
    attempts: number;
    reset_at: Date;
  }>(
    `INSERT INTO quote_rate_limits (key, attempts, reset_at)
     VALUES ($1, 1, CURRENT_TIMESTAMP + INTERVAL '15 minutes')
     ON CONFLICT (key) DO UPDATE SET
       attempts = CASE WHEN quote_rate_limits.reset_at <= CURRENT_TIMESTAMP
         THEN 1 ELSE quote_rate_limits.attempts + 1 END,
       reset_at = CASE WHEN quote_rate_limits.reset_at <= CURRENT_TIMESTAMP
         THEN CURRENT_TIMESTAMP + INTERVAL '15 minutes' ELSE quote_rate_limits.reset_at END
     RETURNING attempts, reset_at`,
    [key],
  );
  return {
    allowed: result.rows[0].attempts <= maximum,
    retryAfter: Math.max(
      1,
      Math.ceil((result.rows[0].reset_at.getTime() - Date.now()) / 1000),
    ),
  };
}

export async function recordQuoteAcceptance(
  record: QuoteRecord,
  quote: PublicQuote,
  selection: QuoteSelection,
  identity: { name: string; email: string },
): Promise<QuoteAcceptance | null> {
  const payload = await getPayload({ config });
  const snapshot = extractQuoteContent(
    quote as unknown as Record<string, unknown>,
  );
  const acceptance: QuoteAcceptance = {
    ...identity,
    acceptedAt: new Date().toISOString(),
    revision: quote.revision,
    selection,
    totals: calculateQuote(snapshot, selection),
    snapshot,
  };
  // One statement is the concurrency boundary. Publication, revocation, expiry,
  // password rotation and prior acceptance are checked again under the row lock.
  // The companion DB trigger prevents changing accepted content afterwards.
  const result = await payload.db.pool.query(
    `UPDATE quotes SET acceptance = $1::jsonb, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND revision = $3 AND password_hash = $4
       AND _status = 'published' AND access_enabled = true
       AND allow_acceptance = true AND acceptance IS NULL
       AND valid_until > CURRENT_TIMESTAMP
       AND (access_expires_at IS NULL OR access_expires_at > CURRENT_TIMESTAMP)
     RETURNING id`,
    [
      JSON.stringify(acceptance),
      record.id,
      quote.revision,
      record.passwordHash,
    ],
  );
  return result.rowCount === 1 ? acceptance : null;
}
