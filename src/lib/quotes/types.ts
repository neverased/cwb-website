export type QuoteLanguage = "pl" | "en";
export type QuoteCurrency = "PLN" | "EUR" | "USD" | "GBP";

export interface QuoteItem {
  id: string;
  name: string;
  description?: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
}

export interface QuotePackage {
  id: string;
  name: string;
  description?: string | null;
  recommended?: boolean | null;
  items: QuoteItem[];
}

export interface QuoteContent {
  number: string;
  title: string;
  language: QuoteLanguage;
  currency: QuoteCurrency;
  clientName: string;
  clientCompany?: string | null;
  clientEmail?: string | null;
  clientDetails?: string | null;
  issuerName: string;
  issuerEmail: string;
  issuerDetails?: string | null;
  issuedAt: string;
  validUntil: string;
  summary: string;
  scope: { id?: string; title: string; body: string }[];
  timeline: {
    id?: string;
    title: string;
    description: string;
    duration: string;
  }[];
  assumptions?: string | null;
  exclusions?: string | null;
  paymentTerms: string;
  notes?: string | null;
  packages: QuotePackage[];
  addons: QuoteItem[];
  discountPercent: number;
}

export interface QuoteSelection {
  packageId: string;
  addonIds: string[];
}

export interface QuoteLineTotal {
  item: QuoteItem;
  subtotal: number;
  discount: number;
  net: number;
  vat: number;
  gross: number;
  addon: boolean;
}

/** All totals are integer minor currency units. */
export interface QuoteTotals {
  lines: QuoteLineTotal[];
  subtotal: number;
  discount: number;
  net: number;
  vat: number;
  gross: number;
}

export interface QuoteAcceptance {
  name: string;
  email: string;
  acceptedAt: string;
  revision: string;
  selection: QuoteSelection;
  totals: QuoteTotals;
  snapshot: QuoteContent;
}

export interface PublicQuote extends QuoteContent {
  preview?: boolean;
  publicId: string;
  revision: string;
  allowAcceptance: boolean;
  acceptance: QuoteAcceptance | null;
}
