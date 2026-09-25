import type { NextRequest } from "next/server";

import {
  createQuoteSession,
  verifyQuotePassword,
} from "@/lib/quotes/credentials";
import {
  quoteJson,
  type QuoteRouteContext,
  readQuoteJson,
  sameQuoteOrigin,
} from "@/lib/quotes/http";
import {
  consumeQuoteAttempt,
  getQuoteRecord,
  quoteCookieName,
  quoteIsAvailable,
  quoteSecret,
} from "@/lib/quotes/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, context: QuoteRouteContext) {
  if (!sameQuoteOrigin(request))
    return quoteJson({ error: "Niedozwolone żądanie." }, 403);
  let password: unknown;
  try {
    ({ password } = await readQuoteJson(request));
  } catch {
    return quoteJson({ error: "Nieprawidłowe dane." }, 400);
  }
  if (
    typeof password !== "string" ||
    password.length > 256 ||
    !password.length
  ) {
    return quoteJson(
      { error: "Nieprawidłowe hasło lub oferta jest niedostępna." },
      401,
    );
  }
  const { publicId } = await context.params;
  const record = await getQuoteRecord(publicId);
  if (!record || !quoteIsAvailable(record))
    return quoteJson(
      { error: "Nieprawidłowe hasło lub oferta jest niedostępna." },
      401,
    );
  const limit = await consumeQuoteAttempt(`unlock:${publicId}`, 10);
  if (!limit.allowed)
    return quoteJson({ error: "Zbyt wiele prób. Spróbuj później." }, 429, {
      "Retry-After": String(limit.retryAfter),
    });
  const globalLimit = await consumeQuoteAttempt("unlock:global", 200);
  if (!globalLimit.allowed)
    return quoteJson({ error: "Zbyt wiele prób. Spróbuj później." }, 429, {
      "Retry-After": String(globalLimit.retryAfter),
    });
  if (!(await verifyQuotePassword(password, record.passwordHash!))) {
    return quoteJson(
      { error: "Nieprawidłowe hasło lub oferta jest niedostępna." },
      401,
    );
  }
  const response = quoteJson({ ok: true });
  response.cookies.set(
    quoteCookieName(publicId),
    createQuoteSession(publicId, record.passwordHash!, quoteSecret()),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 8 * 60 * 60,
    },
  );
  return response;
}
