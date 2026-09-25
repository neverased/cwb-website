import { type NextRequest, NextResponse } from "next/server";

import { calculateQuote, defaultSelection } from "@/lib/quotes/calculations";
import { quoteJson, type QuoteRouteContext } from "@/lib/quotes/http";
import { renderQuotePdf } from "@/lib/quotes/pdf";
import { getAuthorizedQuote, QUOTE_PRIVATE_HEADERS } from "@/lib/quotes/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: QuoteRouteContext) {
  const { publicId } = await context.params;
  const authorized = await getAuthorizedQuote(
    publicId,
    request.nextUrl.searchParams.get("preview") === "1",
  );
  if (!authorized)
    return quoteJson({ error: "Odblokuj ofertę ponownie." }, 401);
  const { quote } = authorized;
  const params = request.nextUrl.searchParams;
  const content = quote.acceptance
    ? { ...quote, ...quote.acceptance.snapshot }
    : quote;
  let selection;
  try {
    selection =
      quote.acceptance?.selection ??
      (params.has("packageId")
        ? {
            packageId: params.get("packageId")!,
            addonIds: params.getAll("addonId"),
          }
        : defaultSelection(quote));
    calculateQuote(content, selection);
  } catch {
    return quoteJson(
      { error: "Nieprawidłowy wybór pakietu lub dodatków." },
      400,
    );
  }
  const buffer = await renderQuotePdf(content, selection);
  const filename =
    quote.number.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) || "wycena";
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      ...QUOTE_PRIVATE_HEADERS,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
    },
  });
}
