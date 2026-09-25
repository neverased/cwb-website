import type { NextRequest } from "next/server";

import { calculateQuote } from "@/lib/quotes/calculations";
import {
  quoteJson,
  type QuoteRouteContext,
  readQuoteJson,
  sameQuoteOrigin,
} from "@/lib/quotes/http";
import { getAuthorizedQuote, recordQuoteAcceptance } from "@/lib/quotes/server";
import type { QuoteSelection } from "@/lib/quotes/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, context: QuoteRouteContext) {
  if (!sameQuoteOrigin(request))
    return quoteJson({ error: "Niedozwolone żądanie." }, 403);
  const { publicId } = await context.params;
  const authorized = await getAuthorizedQuote(publicId);
  if (!authorized)
    return quoteJson({ error: "Odblokuj ofertę ponownie." }, 401);
  const { record, quote } = authorized;
  let body: Record<string, unknown>;
  try {
    body = await readQuoteJson(request);
  } catch {
    return quoteJson({ error: "Nieprawidłowe dane." }, 400);
  }
  if (
    !quote.allowAcceptance ||
    quote.acceptance ||
    body.revision !== quote.revision ||
    Date.parse(quote.validUntil) <= Date.now()
  ) {
    return quoteJson(
      {
        error:
          "Oferta zmieniła się, wygasła lub została już zaakceptowana. Odśwież stronę.",
      },
      409,
    );
  }
  if (
    typeof body.name !== "string" ||
    body.name.trim().length < 2 ||
    body.name.length > 120 ||
    typeof body.email !== "string" ||
    body.email.length > 160 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ||
    body.consent !== true ||
    typeof body.packageId !== "string" ||
    !Array.isArray(body.addonIds) ||
    body.addonIds.length > 30 ||
    body.addonIds.some((id) => typeof id !== "string")
  ) {
    return quoteJson(
      {
        error:
          "Podaj imię, nazwisko i e-mail oraz potwierdź wybrany zakres i warunki.",
      },
      400,
    );
  }
  const selection: QuoteSelection = {
    packageId: body.packageId,
    addonIds: body.addonIds as string[],
  };
  try {
    calculateQuote(quote, selection);
  } catch {
    return quoteJson(
      { error: "Nieprawidłowy wybór pakietu lub dodatków." },
      400,
    );
  }
  const acceptance = await recordQuoteAcceptance(record, quote, selection, {
    name: body.name.trim(),
    email: body.email.trim(),
  });
  if (!acceptance)
    return quoteJson(
      {
        error:
          "Oferta zmieniła się lub została już zaakceptowana. Odśwież stronę.",
      },
      409,
    );
  return quoteJson({ ok: true });
}
