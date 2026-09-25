import type {
  QuoteContent,
  QuoteCurrency,
  QuoteItem,
  QuoteLanguage,
} from "./types";

const text = (value: unknown): string =>
  typeof value === "string" ? value : "";
const optionalText = (value: unknown): string | null => text(value) || null;
const rows = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter((row) => row && typeof row === "object")
    : [];
const numeric = (value: unknown): number =>
  typeof value === "number" ? value : Number.NaN;

function item(raw: Record<string, unknown>): QuoteItem {
  return {
    id: text(raw.id),
    name: text(raw.name),
    description: optionalText(raw.description),
    quantity: numeric(raw.quantity),
    unit: text(raw.unit),
    unitPrice: numeric(raw.unitPrice),
    vatRate: numeric(raw.vatRate),
  };
}

/** Explicit allowlist: never spread CMS documents into client props or PDFs. */
export function extractQuoteContent(
  raw: Record<string, unknown>,
): QuoteContent {
  return {
    number: text(raw.number),
    title: text(raw.title),
    language: raw.language === "en" ? "en" : "pl",
    currency:
      raw.currency === "EUR" || raw.currency === "USD" || raw.currency === "GBP"
        ? raw.currency
        : "PLN",
    clientName: text(raw.clientName),
    clientCompany: optionalText(raw.clientCompany),
    clientEmail: optionalText(raw.clientEmail),
    clientDetails: optionalText(raw.clientDetails),
    issuerName: text(raw.issuerName),
    issuerEmail: text(raw.issuerEmail),
    issuerDetails: optionalText(raw.issuerDetails),
    issuedAt: text(raw.issuedAt),
    validUntil: text(raw.validUntil),
    summary: text(raw.summary),
    scope: rows(raw.scope).map((row) => ({
      title: text(row.title),
      body: text(row.body),
    })),
    timeline: rows(raw.timeline).map((row) => ({
      title: text(row.title),
      description: text(row.description),
      duration: text(row.duration),
    })),
    assumptions: optionalText(raw.assumptions),
    exclusions: optionalText(raw.exclusions),
    paymentTerms: text(raw.paymentTerms),
    notes: optionalText(raw.notes),
    packages: rows(raw.packages).map((row) => ({
      id: text(row.id),
      name: text(row.name),
      description: optionalText(row.description),
      recommended: row.recommended === true,
      items: rows(row.items).map(item),
    })),
    addons: rows(raw.addons).map(item),
    discountPercent:
      raw.discountPercent === undefined || raw.discountPercent === null
        ? 0
        : numeric(raw.discountPercent),
  };
}

export function formatQuoteMoney(
  minor: number,
  currency: QuoteCurrency,
  language: QuoteLanguage,
): string {
  return new Intl.NumberFormat(language === "pl" ? "pl-PL" : "en-GB", {
    style: "currency",
    currency,
  }).format(minor / 100);
}
