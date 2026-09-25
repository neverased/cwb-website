import type { NextRequest } from "next/server";

import {
  quoteJson,
  type QuoteRouteContext,
  sameQuoteOrigin,
} from "@/lib/quotes/http";
import { quoteCookieName, validPublicId } from "@/lib/quotes/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, context: QuoteRouteContext) {
  if (!sameQuoteOrigin(request))
    return quoteJson({ error: "Niedozwolone żądanie." }, 403);
  const { publicId } = await context.params;
  if (!validPublicId(publicId))
    return quoteJson({ error: "Oferta niedostępna." }, 404);
  const response = quoteJson({ ok: true });
  response.cookies.set(quoteCookieName(publicId), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
