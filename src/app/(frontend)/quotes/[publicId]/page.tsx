import type { Metadata } from "next";

import {
  QuoteAccess,
  QuoteIncomplete,
  QuoteUnavailable,
} from "@/components/quotes/quote_access";
import { QuoteOffer } from "@/components/quotes/quote_offer";
import { getQuotePage } from "@/lib/quotes/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Indywidualna oferta | wb_",
  description: "Prywatna oferta współpracy.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
};

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { publicId } = await params;
  const { preview } = await searchParams;
  const page = await getQuotePage(publicId, preview === "1");
  if (page.kind === "unavailable") return <QuoteUnavailable />;
  if (page.kind === "locked") return <QuoteAccess publicId={publicId} />;
  if (page.kind === "incomplete") return <QuoteIncomplete />;
  return (
    <QuoteOffer
      key={`${page.quote.revision}:${page.quote.acceptance?.acceptedAt ?? "open"}`}
      quote={page.quote}
    />
  );
}
