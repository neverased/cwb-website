import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { calculateQuote } from "../src/lib/quotes/calculations";
import { renderQuotePdf } from "../src/lib/quotes/pdf";
import type { PublicQuote, QuoteSelection } from "../src/lib/quotes/types";

// Fictional data. Set QUOTE_PDF_OUTPUT_DIR to save fixtures for visual/text QA.
const selection: QuoteSelection = {
  packageId: "complete",
  addonIds: ["workshop"],
};
const sample: PublicQuote = {
  publicId: "pdf-regression-example",
  revision: "pdf-fixture-v1",
  allowAcceptance: true,
  acceptance: null,
  number: "WB/2026/009",
  title: "Strona, która opowiada Twoją historię.",
  language: "pl",
  currency: "PLN",
  clientName: "Łucja Żółkiewska",
  clientCompany: "Pracownia Źródło",
  clientEmail: "lucja@example.com",
  clientDetails: "ul. Przykładowa 12\n00-001 Warszawa",
  issuerName: "wb_ Studio",
  issuerEmail: "studio@example.com",
  issuerDetails: "Projektowanie i rozwój produktów cyfrowych",
  issuedAt: "2026-09-25T12:00:00.000Z",
  validUntil: "2026-10-25T22:59:00.000Z",
  summary:
    "Nowa strona internetowa dla niezależnej pracowni. Czytelnie pokażemy ofertę, doświadczenie i sposób współpracy. Zaprojektujemy wygodny kontakt na telefonie i komputerze.",
  scope: [
    {
      title: "Projekt i wdrożenie",
      body: "Warsztat, architektura treści i indywidualny projekt. Wdrożenie responsywnej strony z panelem zarządzania treścią. Zażółć gęślą jaźń. ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż.",
    },
  ],
  timeline: [
    {
      title: "01. Kierunek",
      duration: "1 tydzień",
      description: "Warsztat, cele i struktura strony.",
    },
    {
      title: "02. Projekt i realizacja",
      duration: "3 tygodnie",
      description: "Projekt graficzny, wdrożenie i testy na urządzeniach.",
    },
  ],
  assumptions:
    "Klient dostarcza zatwierdzone teksty oraz zdjęcia przed rozpoczęciem wdrożenia.",
  exclusions:
    "Hosting, domena, płatne zdjęcia i stałe utrzymanie nie są objęte wyceną.",
  paymentTerms:
    "40% po zatwierdzeniu oferty, 60% po odbiorze projektu. Termin płatności: 14 dni.",
  notes: "Porozmawiajmy o szczegółach. Dziękuję za zaufanie. KONIEC-OFERTY-PL",
  packages: [
    {
      id: "complete",
      name: "Kompletny projekt",
      description: "Od pierwszego szkicu do uruchomienia gotowej strony.",
      recommended: true,
      items: [
        {
          id: "design",
          name: "Strategia i projekt interfejsu",
          description:
            "Architektura informacji, układy desktop/mobile oraz dwie rundy uwag.",
          quantity: 1,
          unit: "projekt",
          unitPrice: 4500,
          vatRate: 23,
        },
        {
          id: "build",
          name: "Wdrożenie strony i CMS",
          description:
            "Responsywność, dostępność, formularz kontaktowy i szkolenie z obsługi.",
          quantity: 1,
          unit: "projekt",
          unitPrice: 7500,
          vatRate: 23,
        },
        {
          id: "support",
          name: "Konsultacje po wdrożeniu",
          description: "Wsparcie zespołu podczas publikacji nowych treści.",
          quantity: 2.5,
          unit: "godz.",
          unitPrice: 250,
          vatRate: 23,
        },
      ],
    },
  ],
  addons: [
    {
      id: "workshop",
      name: "Dodatkowy warsztat zespołowy",
      description: "Praktyczna praca z panelem i plan publikacji treści.",
      quantity: 1,
      unit: "warsztat",
      unitPrice: 800,
      vatRate: 8,
    },
  ],
  discountPercent: 5,
};

function pages(pdf: Buffer) {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) ?? []).length;
}

function verifyPdf(pdf: Buffer) {
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.ok(pdf.length > 10_000, "PDF includes document and embedded fonts");
  assert.ok(
    pdf.toString("latin1").includes("/FontFile2"),
    "TrueType font is embedded",
  );
  assert.ok(
    pdf.toString("latin1").includes("/ToUnicode"),
    "PDF includes Unicode text mapping",
  );
  assert.ok(
    pdf.subarray(-50).toString().includes("%%EOF"),
    "PDF stream finished",
  );
}

const shortPdf = await renderQuotePdf(sample, selection);
verifyPdf(shortPdf);
assert.ok(
  pages(shortPdf) >= 2 && pages(shortPdf) <= 5,
  "Normal proposal paginates without runaway blank pages",
);

const long = structuredClone(sample);
long.title = "Rozbudowana oferta, która zachowuje cały zakres i każdą pozycję";
long.summary = `${sample.summary}\n${"Opis wymagający prawidłowego podziału między stronami. ".repeat(100)}\nKONIEC-DŁUGIEGO-WSTĘPU`;
long.packages[0].items = Array.from({ length: 45 }, (_, index) => ({
  ...sample.packages[0].items[index % sample.packages[0].items.length],
  id: `item-${index}`,
  name: `Pozycja ${index + 1}: pełen zakres świadczenia`,
  description:
    index === 20
      ? `${"Bardzo długi opis pojedynczej pozycji, który musi przejść na kolejne strony. ".repeat(140)} KONIEC-DŁUGIEJ-POZYCJI`
      : `${sample.packages[0].items[0].description} Zakończenie pozycji ${index + 1}.`,
}));
long.scope = [
  {
    title: "Długi, niepodzielny identyfikator",
    body: `REFERENCE-${"ABC123".repeat(220)}-END`,
  },
  {
    title: "Szczegółowy opis",
    body: `${"Założenia, wyłączenia i pełne warunki współpracy. ".repeat(200)} KONIEC-ZAKRESU`,
  },
];
long.notes =
  "Ostatni akapit: wszystkie treści przetrwały podział stron. KONIEC-DŁUGIEJ-OFERTY";
const longPdf = await renderQuotePdf(long, selection);
verifyPdf(longPdf);
assert.ok(
  pages(longPdf) > pages(shortPdf) + 5,
  "Long rows and narrative flow across multiple pages",
);
assert.ok(pages(longPdf) < 60, "Pagination does not create runaway pages");

const english = structuredClone(sample);
Object.assign(english, {
  language: "en",
  currency: "EUR",
  number: "WB/2026/010",
  title: "A website that tells your story.",
  summary:
    "A clear, accessible website for an independent studio, with a responsive interface and an easy content workflow.",
  scope: [
    {
      title: "Design and development",
      body: "Information architecture, responsive design, implementation, quality assurance and editor training.",
    },
  ],
  timeline: [
    {
      title: "Design and delivery",
      duration: "4 weeks",
      description:
        "A workshop, design reviews and implementation with an agreed launch checklist.",
    },
  ],
  assumptions:
    "Approved copy and images are supplied before development begins.",
  exclusions:
    "Hosting, domain registration and ongoing maintenance are excluded.",
  paymentTerms:
    "40% upon acceptance and 60% upon delivery. Payment is due within 14 days.",
  notes: "Thank you for considering this proposal. END-OF-PROPOSAL-EN",
});
english.packages[0].name = "Complete website";
english.packages[0].description = "From the first concept through launch.";
english.packages[0].items = [
  {
    id: "website",
    name: "Website design and development",
    description:
      "Desktop and mobile layouts, content management and two review rounds.",
    quantity: 1,
    unit: "project",
    unitPrice: 5500,
    vatRate: 23,
  },
];
english.addons[0] = {
  ...english.addons[0],
  name: "Team workshop",
  description: "A practical editor training session.",
  unit: "session",
};
english.acceptance = {
  name: "Łucja Żółkiewska",
  email: "lucja@example.com",
  acceptedAt: "2026-09-26T10:30:00.000Z",
  revision: english.revision,
  selection,
  totals: calculateQuote(english, selection),
  snapshot: { ...english },
};
const englishPdf = await renderQuotePdf(english, selection);
verifyPdf(englishPdf);
assert.ok(pages(englishPdf) >= 2 && pages(englishPdf) <= 5);
await assert.rejects(
  renderQuotePdf(sample, { packageId: "unknown", addonIds: [] }),
  "Unknown selections are never rendered",
);

const outputDirectory = process.env.QUOTE_PDF_OUTPUT_DIR;
if (outputDirectory) {
  await mkdir(outputDirectory, { recursive: true });
  for (const [name, pdf] of [
    ["quotes-short-pl.pdf", shortPdf],
    ["quotes-long-pl.pdf", longPdf],
    ["quotes-accepted-en.pdf", englishPdf],
  ] as const) {
    await writeFile(path.join(outputDirectory, name), pdf);
  }
}
console.log(
  `Quote PDF regression passed: Polish ${pages(shortPdf)} pages, long content ${pages(longPdf)} pages, accepted English ${pages(englishPdf)} pages.`,
);
