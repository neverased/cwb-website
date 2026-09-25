import path from "node:path";

import PDFDocument from "pdfkit";

import { calculateQuote } from "./calculations";
import { formatQuoteMoney } from "./presentation";
import type { PublicQuote, QuoteLineTotal, QuoteSelection } from "./types";

const INK = "#0b0f10";
const GREEN = "#185b48";
const MINT = "#e5f5ed";
const MUTED = "#596761";
const RULE = "#d6e0da";
const MARGIN = 44;
const BODY_TOP = 88;
const BODY_BOTTOM = 776;
const REGULAR = "QuoteRegular";
const BOLD = "QuoteBold";

const labels = {
  pl: {
    offer: "OFERTA WSPÓŁPRACY",
    client: "PRZYGOTOWANO DLA",
    issuer: "PRZYGOTOWAŁ",
    issued: "Data wystawienia",
    valid: "Ważna do",
    currency: "Waluta",
    number: "Oferta",
    summary: "O projekcie",
    package: "Wybrany pakiet",
    pricing: "Wycena",
    item: "Usługa / zakres",
    quantity: "Ilość",
    unitPrice: "Cena j. netto",
    vat: "VAT",
    net: "Netto",
    gross: "Brutto",
    addon: "DODATEK",
    subtotal: "Suma przed rabatem",
    discount: "Rabat",
    totalNet: "Razem netto",
    totalVat: "Podatek VAT",
    totalGross: "Razem brutto",
    scope: "Zakres współpracy",
    timeline: "Harmonogram",
    assumptions: "Założenia",
    exclusions: "Poza zakresem",
    payment: "Warunki płatności",
    notes: "Dodatkowe informacje",
    accepted: "Oferta zaakceptowana",
    acceptedBy: "Akceptacja",
    acceptedAt: "Data akceptacji",
    revision: "Wersja",
    page: "Strona",
    private: "Oferta indywidualna",
    afterDiscount: "Kwoty netto i brutto uwzględniają rabat.",
    acceptanceNote: "Zapis akceptacji wybranej konfiguracji i wersji oferty.",
  },
  en: {
    offer: "PROJECT PROPOSAL",
    client: "PREPARED FOR",
    issuer: "PREPARED BY",
    issued: "Issue date",
    valid: "Valid until",
    currency: "Currency",
    number: "Proposal",
    summary: "About the project",
    package: "Selected package",
    pricing: "Pricing",
    item: "Service / scope",
    quantity: "Quantity",
    unitPrice: "Unit price, net",
    vat: "VAT",
    net: "Net",
    gross: "Gross",
    addon: "ADD-ON",
    subtotal: "Subtotal before discount",
    discount: "Discount",
    totalNet: "Total net",
    totalVat: "VAT total",
    totalGross: "Total gross",
    scope: "Scope of work",
    timeline: "Timeline",
    assumptions: "Assumptions",
    exclusions: "Exclusions",
    payment: "Payment terms",
    notes: "Additional information",
    accepted: "Proposal accepted",
    acceptedBy: "Accepted by",
    acceptedAt: "Acceptance date",
    revision: "Revision",
    page: "Page",
    private: "Private proposal",
    afterDiscount: "Net and gross amounts include the discount.",
    acceptanceNote:
      "Recorded acceptance of the selected configuration and proposal revision.",
  },
} as const;

/** Local, embedded-font renderer. Call only after authenticating the quote request. */
export async function renderQuotePdf(
  quote: PublicQuote,
  selection: QuoteSelection,
): Promise<Buffer> {
  const totals = calculateQuote(quote, selection);
  const selectedPackage = quote.packages.find(
    (item) => item.id === selection.packageId,
  )!;
  const t = labels[quote.language];
  const locale = quote.language === "pl" ? "pl-PL" : "en-GB";
  const money = (minor: number) =>
    formatQuoteMoney(minor, quote.currency, quote.language);
  const number = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(value);
  const date = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(value));
  const dateTime = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Warsaw",
    }).format(new Date(value));
  const fontDirectory = path.join(process.cwd(), "public", "fonts", "quote");
  const doc = new PDFDocument({
    size: "A4",
    autoFirstPage: false,
    bufferPages: true,
    margins: { top: BODY_TOP, right: MARGIN, bottom: 65, left: MARGIN },
    font: path.join(fontDirectory, "SpaceGrotesk-Regular.ttf"),
    info: {
      Title: `${quote.number} | ${quote.title}`,
      Author: quote.issuerName,
      Subject: t.offer,
      Creator: "wb_",
    },
  });
  doc.registerFont(
    REGULAR,
    path.join(fontDirectory, "SpaceGrotesk-Regular.ttf"),
  );
  doc.registerFont(BOLD, path.join(fontDirectory, "SpaceGrotesk-Bold.ttf"));
  const chunks: Buffer[] = [];
  const output = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  let y = BODY_TOP;
  const width = 595.28 - MARGIN * 2;
  const right = MARGIN + width;
  const setFont = (font = REGULAR, size = 10, color = INK) =>
    doc.font(font).fontSize(size).fillColor(color);
  const drawLine = (
    text: string,
    x: number,
    top: number,
    font = REGULAR,
    size = 10,
    color = INK,
  ) => {
    setFont(font, size, color).text(text, x, top, { lineBreak: false });
  };

  // Explicit lines make pagination deterministic, including paragraphs and table
  // cells longer than an entire page. No height/ellipsis option can discard text.
  function wrap(
    text: string,
    availableWidth: number,
    font = REGULAR,
    size = 10,
  ): string[] {
    setFont(font, size);
    const lines: string[] = [];
    for (const paragraph of text.replace(/\r\n?/g, "\n").split("\n")) {
      if (!paragraph.trim()) {
        lines.push("");
        continue;
      }
      let line = "";
      for (const word of paragraph.trim().split(/\s+/u)) {
        const candidate = line ? `${line} ${word}` : word;
        if (doc.widthOfString(candidate) <= availableWidth) {
          line = candidate;
          continue;
        }
        if (line) {
          lines.push(line);
          line = "";
        }
        // Long references/URLs/unbroken text also wrap instead of overflowing.
        for (const character of word) {
          if (line && doc.widthOfString(line + character) > availableWidth) {
            lines.push(line);
            line = "";
          }
          line += character;
        }
      }
      if (line) lines.push(line);
    }
    return lines;
  }

  function newPage() {
    doc.addPage();
    doc.rect(0, 0, doc.page.width, 5).fill(GREEN);
    drawLine("wb_", MARGIN, 29, BOLD, 27);
    drawLine(
      t.offer,
      right - doc.font(BOLD).fontSize(8).widthOfString(t.offer),
      39,
      BOLD,
      8,
      GREEN,
    );
    doc
      .moveTo(MARGIN, 68)
      .lineTo(right, 68)
      .lineWidth(0.6)
      .strokeColor(RULE)
      .stroke();
    y = BODY_TOP;
  }

  function ensure(height: number) {
    if (y + height > BODY_BOTTOM) newPage();
  }

  function paragraph(
    text: string | null | undefined,
    options: {
      font?: string;
      size?: number;
      color?: string;
      gap?: number;
    } = {},
  ) {
    if (!text) return;
    const { font = REGULAR, size = 10, color = INK, gap = 10 } = options;
    const lineHeight = size * 1.5;
    for (const line of wrap(text, width, font, size)) {
      ensure(lineHeight);
      drawLine(line, MARGIN, y, font, size, color);
      y += lineHeight;
    }
    y += gap;
  }

  function heading(title: string) {
    ensure(64);
    y += 14;
    paragraph(title, { font: BOLD, size: 16, gap: 12 });
  }

  function section(title: string, text: string | null | undefined) {
    if (!text) return;
    heading(title);
    paragraph(text);
  }

  function partyColumns() {
    const gap = 30;
    const columnWidth = (width - gap) / 2;
    const parties = [
      {
        label: t.client,
        details: [
          quote.clientName,
          quote.clientCompany,
          quote.clientEmail,
          quote.clientDetails,
        ],
      },
      {
        label: t.issuer,
        details: [quote.issuerName, quote.issuerEmail, quote.issuerDetails],
      },
    ];
    const columns = parties.map(({ label, details }) => [
      { text: label, bold: true, label: true },
      ...details
        .filter((value): value is string => !!value)
        .flatMap((value, index) =>
          wrap(value, columnWidth, index === 0 ? BOLD : REGULAR, 10).map(
            (text) => ({ text, bold: index === 0, label: false }),
          ),
        ),
    ]);
    const count = Math.max(...columns.map((column) => column.length));
    ensure(Math.min(count * 16 + 14, 140));
    for (let index = 0; index < count; index++) {
      ensure(16);
      columns.forEach((column, side) => {
        const line = column[index];
        if (line)
          drawLine(
            line.text,
            MARGIN + side * (columnWidth + gap),
            y,
            line.bold ? BOLD : REGULAR,
            line.label ? 8 : 10,
            line.label ? GREEN : INK,
          );
      });
      y += 16;
    }
    y += 17;
  }

  const columnWidths = [190, 55, 75, 38, 72, width - 430];
  const columnLabels = [t.item, t.quantity, t.unitPrice, t.vat, t.net, t.gross];
  function tableHeader() {
    doc.rect(MARGIN, y, width, 30).fill(MINT);
    let x = MARGIN;
    columnLabels.forEach((label, index) => {
      const lines = wrap(label, columnWidths[index] - 14, BOLD, 7.7);
      lines.forEach((line, row) =>
        drawLine(line, x + 7, y + 5 + row * 10, BOLD, 7.7, GREEN),
      );
      x += columnWidths[index];
    });
    y += 30;
  }

  function tableRow(line: QuoteLineTotal) {
    type CellLine = { text: string; font: string; size: number; color: string };
    const cell = (
      value: string,
      column: number,
      font = REGULAR,
      size = 8.4,
      color = INK,
    ): CellLine[] =>
      wrap(value, columnWidths[column] - 14, font, size).map((text) => ({
        text,
        font,
        size,
        color,
      }));
    const cells = [
      [
        ...(line.addon ? cell(t.addon, 0, BOLD, 7, GREEN) : []),
        ...cell(line.item.name, 0, BOLD, 9.5),
        ...(line.item.description
          ? cell(line.item.description, 0, REGULAR, 8.4, MUTED)
          : []),
      ],
      cell(`${number(line.item.quantity)} ${line.item.unit}`, 1),
      cell(money(Math.round(line.item.unitPrice * 100)), 2),
      cell(`${number(line.item.vatRate)}%`, 3),
      cell(money(line.net), 4),
      cell(money(line.gross), 5, BOLD),
    ];
    const count = Math.max(...cells.map((column) => column.length));
    const rowHeight = count * 13 + 18;
    if (
      rowHeight <= BODY_BOTTOM - BODY_TOP - 30 &&
      y + rowHeight > BODY_BOTTOM
    ) {
      newPage();
      tableHeader();
    }
    let offset = 0;
    while (offset < count) {
      let fit = Math.floor((BODY_BOTTOM - y - 18) / 13);
      if (fit < 1) {
        newPage();
        tableHeader();
        fit = Math.floor((BODY_BOTTOM - y - 18) / 13);
      }
      const amount = Math.min(fit, count - offset);
      const top = y + 9;
      let x = MARGIN;
      cells.forEach((column, index) => {
        for (let i = 0; i < amount; i++) {
          const row = column[offset + i];
          if (row)
            drawLine(
              row.text,
              x + 7,
              top + i * 13,
              row.font,
              row.size,
              row.color,
            );
        }
        x += columnWidths[index];
      });
      y += amount * 13 + 18;
      doc
        .moveTo(MARGIN, y)
        .lineTo(right, y)
        .lineWidth(0.5)
        .strokeColor(RULE)
        .stroke();
      offset += amount;
      if (offset < count) {
        newPage();
        tableHeader();
      }
    }
  }

  function summaryTotals() {
    ensure(190);
    y += 17;
    const totalRows = [
      [t.subtotal, money(totals.subtotal)],
      [
        `${t.discount} (${number(quote.discountPercent)}%)`,
        `${totals.discount ? "-" : ""}${money(totals.discount)}`,
      ],
      [t.totalNet, money(totals.net)],
      [t.totalVat, money(totals.vat)],
    ];
    totalRows.forEach(([label, value]) => {
      drawLine(label, MARGIN + 195, y, REGULAR, 10, MUTED);
      setFont(BOLD, 10);
      drawLine(value, right - doc.widthOfString(value), y, BOLD, 10);
      y += 23;
    });
    doc.rect(MARGIN, y + 1, width, 48).fill(MINT);
    drawLine(t.totalGross, MARGIN + 13, y + 15, BOLD, 12, GREEN);
    setFont(BOLD, 20);
    const gross = money(totals.gross);
    drawLine(
      gross,
      right - 13 - doc.widthOfString(gross),
      y + 10,
      BOLD,
      20,
      GREEN,
    );
    y += 61;
    if (quote.discountPercent > 0)
      paragraph(t.afterDiscount, { size: 8, color: MUTED });
  }

  try {
    newPage();
    paragraph(`${t.number} ${quote.number}`, {
      font: BOLD,
      size: 9,
      color: GREEN,
      gap: 12,
    });
    paragraph(quote.title, { font: BOLD, size: 30, gap: 19 });
    paragraph(
      `${t.issued}: ${date(quote.issuedAt)}  ·  ${t.valid}: ${dateTime(quote.validUntil)} (Europe/Warsaw)  ·  ${t.currency}: ${quote.currency}`,
      { size: 8.7, color: MUTED, gap: 22 },
    );
    partyColumns();
    section(t.summary, quote.summary);
    heading(t.package);
    paragraph(selectedPackage.name, {
      font: BOLD,
      size: 14,
      color: GREEN,
      gap: 8,
    });
    paragraph(selectedPackage.description);
    heading(t.pricing);
    ensure(75);
    tableHeader();
    for (const line of totals.lines) tableRow(line);
    summaryTotals();

    if (quote.scope.length) {
      heading(t.scope);
      for (const item of quote.scope) {
        ensure(55);
        paragraph(item.title, { font: BOLD, size: 11, gap: 6 });
        paragraph(item.body, { gap: 15 });
      }
    }
    if (quote.timeline.length) {
      heading(t.timeline);
      for (const item of quote.timeline) {
        ensure(65);
        paragraph(item.title, { font: BOLD, size: 11, gap: 3 });
        paragraph(item.duration, { size: 9, color: GREEN, gap: 5 });
        paragraph(item.description, { gap: 15 });
      }
    }
    section(t.assumptions, quote.assumptions);
    section(t.exclusions, quote.exclusions);
    section(t.payment, quote.paymentTerms);
    section(t.notes, quote.notes);
    if (quote.acceptance) {
      heading(t.accepted);
      paragraph(
        `${t.acceptedBy}: ${quote.acceptance.name} (${quote.acceptance.email})`,
      );
      paragraph(
        `${t.acceptedAt}: ${dateTime(quote.acceptance.acceptedAt)} (Europe/Warsaw)`,
      );
      paragraph(`${t.revision}: ${quote.acceptance.revision}`, {
        size: 8,
        color: MUTED,
      });
      paragraph(t.acceptanceNote, { size: 8, color: MUTED });
    }

    const pages = doc.bufferedPageRange();
    for (let page = pages.start; page < pages.start + pages.count; page++) {
      doc.switchToPage(page);
      doc
        .moveTo(MARGIN, 795)
        .lineTo(right, 795)
        .lineWidth(0.5)
        .strokeColor(RULE)
        .stroke();
      drawLine(`wb_  /  ${t.private}`, MARGIN, 807, REGULAR, 8, MUTED);
      const pageLabel = `${t.page} ${page + 1} / ${pages.count}`;
      setFont(REGULAR, 8);
      drawLine(
        pageLabel,
        right - doc.widthOfString(pageLabel),
        807,
        REGULAR,
        8,
        MUTED,
      );
    }
    doc.end();
  } catch (error) {
    // The stream already has an error listener, so failed authoring rejects the
    // returned promise without leaving a second unhandled stream rejection.
    doc.destroy(
      error instanceof Error ? error : new Error("PDF rendering failed"),
    );
  }
  return output;
}
