import type {
  QuoteContent,
  QuoteItem,
  QuoteLineTotal,
  QuoteSelection,
  QuoteTotals,
} from "./types";

/** Exact decimal conversion before any arithmetic; additional precision is rejected. */
function scaled(
  value: number,
  precision: number,
  maximum: number,
  label: string,
): bigint {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > maximum
  ) {
    throw new Error(`Invalid ${label}`);
  }
  const text = String(value);
  if (!new RegExp(`^\\d+(?:\\.\\d{1,${precision}})?$`).test(text)) {
    throw new Error(`Invalid ${label} precision`);
  }
  const [whole, fraction = ""] = text.split(".");
  return (
    BigInt(whole) * 10n ** BigInt(precision) +
    BigInt(fraction.padEnd(precision, "0"))
  );
}

function rounded(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator / 2n) / denominator;
}

function safeNumber(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error("Quote amount exceeds the supported range");
  return Number(value);
}

function validateIds(
  items: { id: string }[],
  maximum: number,
  label: string,
): void {
  if (!Array.isArray(items) || items.length > maximum)
    throw new Error(`Invalid ${label}`);
  const ids = new Set<string>();
  for (const item of items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !item.id ||
      item.id.length > 100 ||
      ids.has(item.id)
    ) {
      throw new Error(`Invalid ${label} identifier`);
    }
    ids.add(item.id);
  }
}

function lineTotal(
  item: QuoteItem,
  discountRate: bigint,
  addon: boolean,
): QuoteLineTotal {
  const quantity = scaled(item.quantity, 3, 1_000_000, "quantity");
  if (!quantity) throw new Error("Quantity must be greater than zero");
  const price = scaled(item.unitPrice, 2, 1_000_000_000, "unit price");
  const vatRate = scaled(item.vatRate, 2, 100, "VAT rate");
  const subtotal = rounded(quantity * price, 1000n);
  const discount = rounded(subtotal * discountRate, 10000n);
  const net = subtotal - discount;
  const vat = rounded(net * vatRate, 10000n);
  return {
    item,
    subtotal: safeNumber(subtotal),
    discount: safeNumber(discount),
    net: safeNumber(net),
    vat: safeNumber(vat),
    gross: safeNumber(net + vat),
    addon,
  };
}

export function defaultSelection(content: QuoteContent): QuoteSelection {
  const selected =
    content.packages.find((entry) => entry.recommended) ?? content.packages[0];
  if (!selected) throw new Error("At least one package is required");
  return { packageId: selected.id, addonIds: [] };
}

/** Round each line: quantity × price, discount, then VAT. Values are minor units. */
export function calculateQuote(
  content: QuoteContent,
  selection: QuoteSelection,
): QuoteTotals {
  validateIds(content.packages, 5, "packages");
  validateIds(content.addons, 30, "additions");
  if (
    !selection ||
    typeof selection.packageId !== "string" ||
    !Array.isArray(selection.addonIds) ||
    selection.addonIds.length > 30
  ) {
    throw new Error("Invalid quote selection");
  }
  const selectedPackage = content.packages.find(
    (entry) => entry.id === selection.packageId,
  );
  if (!selectedPackage) throw new Error("Unknown package");
  validateIds(selectedPackage.items, 50, "package items");
  if (!selectedPackage.items.length)
    throw new Error("At least one package item is required");
  const addonIds = new Set(selection.addonIds);
  if (
    addonIds.size !== selection.addonIds.length ||
    selection.addonIds.some(
      (id) =>
        typeof id !== "string" ||
        !content.addons.some((entry) => entry.id === id),
    )
  ) {
    throw new Error("Unknown or duplicate addition");
  }
  const discountRate = scaled(content.discountPercent, 2, 100, "discount");
  // Preserve the author's item order, independently of client request ordering.
  const lines = [
    ...selectedPackage.items.map((item) =>
      lineTotal(item, discountRate, false),
    ),
    ...content.addons
      .filter((item) => addonIds.has(item.id))
      .map((item) => lineTotal(item, discountRate, true)),
  ];
  const totals: QuoteTotals = {
    lines,
    subtotal: 0,
    discount: 0,
    net: 0,
    vat: 0,
    gross: 0,
  };
  for (const key of ["subtotal", "discount", "net", "vat", "gross"] as const) {
    totals[key] = safeNumber(
      lines.reduce((sum, line) => sum + BigInt(line[key]), 0n),
    );
  }
  return totals;
}
