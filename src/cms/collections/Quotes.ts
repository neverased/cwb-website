import { randomBytes } from "node:crypto";

import {
  type Access,
  APIError,
  type CollectionConfig,
  type CollectionSlug,
  type Field,
} from "payload";

import { calculateQuote } from "../../lib/quotes/calculations";
import { hashQuotePassword, quoteRevision } from "../../lib/quotes/credentials";
import { extractQuoteContent } from "../../lib/quotes/presentation";

const ownerOnly: Access = ({ req }) => req.user?.collection === "users";
const serverWritten = { create: () => false, update: () => false };
const resetOnDuplicate = { beforeDuplicate: [() => null] };

const itemFields = (): Field[] => [
  {
    name: "name",
    label: "Nazwa usługi",
    type: "text",
    required: true,
    maxLength: 180,
  },
  { name: "description", label: "Opis", type: "textarea", maxLength: 2000 },
  {
    type: "row",
    fields: [
      {
        name: "quantity",
        label: "Ilość",
        type: "number",
        required: true,
        defaultValue: 1,
        min: 0.001,
        max: 1_000_000,
        admin: { step: 0.001, width: "25%" },
      },
      {
        name: "unit",
        label: "Jednostka",
        type: "text",
        required: true,
        defaultValue: "usługa",
        maxLength: 32,
        admin: { width: "25%" },
      },
      {
        name: "unitPrice",
        label: "Cena jednostkowa netto",
        type: "number",
        required: true,
        min: 0,
        max: 1_000_000_000,
        admin: { step: 0.01, width: "25%" },
      },
      {
        name: "vatRate",
        label: "VAT (%)",
        type: "number",
        required: true,
        defaultValue: 23,
        min: 0,
        max: 100,
        admin: { step: 0.01, width: "25%" },
      },
    ],
  },
];

function validateBounds(data: Record<string, unknown>): void {
  const lengths: Record<string, number> = {
    number: 80,
    title: 180,
    clientName: 160,
    clientCompany: 200,
    clientEmail: 254,
    clientDetails: 2000,
    issuerName: 160,
    issuerEmail: 254,
    issuerDetails: 2000,
    summary: 6000,
    assumptions: 6000,
    exclusions: 6000,
    paymentTerms: 6000,
    notes: 6000,
  };
  const limitText = (
    row: Record<string, unknown>,
    limits: Record<string, number>,
  ) => {
    for (const [key, maximum] of Object.entries(limits)) {
      if (
        row[key] != null &&
        (typeof row[key] !== "string" || row[key].length > maximum)
      )
        throw new APIError(`Pole ${key}: maksymalnie ${maximum} znaków.`, 400);
    }
  };
  limitText(data, lengths);
  for (const [key, maximum] of [
    ["packages", 5],
    ["addons", 30],
    ["scope", 20],
    ["timeline", 20],
  ] as const) {
    const value = data[key];
    if (value != null && (!Array.isArray(value) || value.length > maximum))
      throw new APIError(`Pole ${key}: maksymalnie ${maximum} pozycji.`, 400);
  }
  for (const pkg of (data.packages ?? []) as Record<string, unknown>[]) {
    if (
      !pkg ||
      (pkg.items != null &&
        (!Array.isArray(pkg.items) || pkg.items.length > 50))
    )
      throw new APIError("Pakiet może zawierać maksymalnie 50 pozycji.", 400);
    limitText(pkg, { name: 120, description: 2000 });
    for (const item of (pkg.items ?? []) as Record<string, unknown>[]) {
      if (!item) throw new APIError("Nieprawidłowa pozycja pakietu.", 400);
      limitText(item, { name: 180, description: 2000, unit: 32 });
    }
  }
  for (const key of ["scope", "timeline", "addons"] as const) {
    for (const row of (data[key] ?? []) as Record<string, unknown>[]) {
      if (!row) throw new APIError("Nieprawidłowa pozycja.", 400);
      limitText(
        row,
        key === "scope"
          ? { title: 180, body: 6000 }
          : key === "timeline"
            ? { title: 180, description: 2000, duration: 160 }
            : { name: 180, description: 2000, unit: 32 },
      );
    }
  }
}

export const Quotes: CollectionConfig = {
  slug: "quotes",
  labels: { singular: "Wycena", plural: "Wyceny" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["number", "title", "clientName", "_status", "validUntil"],
    description:
      "Przygotuj pakiety i warunki. Po publikacji udostępnij klientowi link oraz osobno hasło. Zaakceptowaną wycenę można skopiować, aby przygotować nowe warunki.",
    preview: (doc) =>
      doc?.publicId ? `/quotes/${doc.publicId}/?preview=1` : null,
  },
  access: {
    create: ownerOnly,
    read: ownerOnly,
    update: ownerOnly,
    delete: ownerOnly,
    readVersions: ownerOnly,
  },
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: {
    afterRead: [
      async ({ doc, req, collection }) => {
        // Payload 3 excludes the collection's root id from historical version
        // payloads (buildVersionCollectionFields). Only normal document reads,
        // including draft=true, carry it. Keep historical version data intact.
        if (!doc.id || doc.acceptance) return doc;
        const current = await req.payload.db.findOne<
          Record<string, unknown> & { id: number | string }
        >({
          collection: collection.slug as CollectionSlug,
          where: { id: { equals: doc.id } },
          select: { acceptance: true },
          req,
        });
        // Acceptance is written atomically to the main row by the client route.
        // Do not copy any other main-row values (especially hidden credentials)
        // into the already access-filtered response or overwrite draft content.
        if (current?.acceptance) doc.acceptance = current.acceptance;
        return doc;
      },
    ],
    beforeOperation: [
      ({ args, operation }) => {
        // Duplicating a published document must never publish inherited credentials.
        if (
          operation === "create" &&
          "duplicateFromID" in args &&
          args.duplicateFromID != null
        ) {
          args.draft = true;
          args.data = { ...args.data, _status: "draft" };
          delete args.data.password;
        }
        return args;
      },
    ],
    beforeChange: [
      async ({ data, operation, originalDoc, req, collection }) => {
        validateBounds(data);
        const password = data.password;
        // The field is virtual as a second safeguard, but remove it before version hooks.
        delete data.password;
        data.publicId =
          operation === "create"
            ? randomBytes(16).toString("hex")
            : originalDoc?.publicId;
        data.passwordHash =
          operation === "create" ? null : (originalDoc?.passwordHash ?? null);
        data.acceptance =
          operation === "create" ? null : (originalDoc?.acceptance ?? null);
        data.revision =
          operation === "create" ? null : (originalDoc?.revision ?? null);

        // Acceptance can have arrived since this draft was created. Read the main row;
        // the database trigger additionally protects the race after this check.
        if (operation === "update" && originalDoc?.id) {
          const current = await req.payload.db.findOne<
            Record<string, unknown> & { id: number | string }
          >({
            collection: collection.slug as CollectionSlug,
            where: { id: { equals: originalDoc.id } },
            req,
          });
          if (current?.acceptance) data.acceptance = current.acceptance;
        }

        if (password != null && password !== "") {
          try {
            data.passwordHash = await hashQuotePassword(password);
          } catch (error) {
            throw new APIError(
              error instanceof Error ? error.message : "Nieprawidłowe hasło.",
              400,
            );
          }
        }

        const content = extractQuoteContent(data);
        const revision = quoteRevision(content);
        if (data.acceptance && revision !== data.acceptance.revision) {
          throw new APIError(
            "Zaakceptowana wycena jest zamknięta. Utwórz kopię, aby zmienić jej treść lub ceny.",
            400,
          );
        }

        if (data._status === "published") {
          if (!data.passwordHash)
            throw new APIError(
              "Przed publikacją ustaw hasło dostępu (12–256 znaków).",
              400,
            );
          if (!content.packages.length)
            throw new APIError("Dodaj co najmniej jeden pakiet.", 400);
          try {
            for (const pkg of content.packages) {
              calculateQuote(content, {
                packageId: pkg.id,
                addonIds: content.addons.map((entry) => entry.id),
              });
            }
          } catch (error) {
            throw new APIError(
              `Sprawdź pakiety i ceny: ${error instanceof Error ? error.message : "Nieprawidłowe dane."}`,
              400,
            );
          }
          if (
            !Number.isFinite(Date.parse(content.validUntil)) ||
            !Number.isFinite(Date.parse(content.issuedAt)) ||
            Date.parse(content.validUntil) <= Date.parse(content.issuedAt)
          ) {
            throw new APIError(
              "Termin ważności musi przypadać po dacie wystawienia.",
              400,
            );
          }
          data.revision = revision;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Oferta i klient",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "number",
                  label: "Numer oferty",
                  type: "text",
                  required: true,
                  maxLength: 80,
                  admin: { width: "35%" },
                },
                {
                  name: "title",
                  label: "Nazwa projektu",
                  type: "text",
                  required: true,
                  maxLength: 180,
                  admin: { width: "65%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "language",
                  label: "Język oferty",
                  type: "select",
                  required: true,
                  defaultValue: "pl",
                  options: [
                    { label: "Polski", value: "pl" },
                    { label: "English", value: "en" },
                  ],
                  admin: { width: "50%" },
                },
                {
                  name: "currency",
                  label: "Waluta",
                  type: "select",
                  required: true,
                  defaultValue: "PLN",
                  options: ["PLN", "EUR", "USD", "GBP"],
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "issuedAt",
                  label: "Data wystawienia",
                  type: "date",
                  required: true,
                  defaultValue: () => new Date().toISOString(),
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "dayAndTime" },
                  },
                },
                {
                  name: "validUntil",
                  label: "Ważna do (data i godzina)",
                  type: "date",
                  required: true,
                  defaultValue: () =>
                    new Date(Date.now() + 14 * 86400000).toISOString(),
                  admin: {
                    width: "50%",
                    description:
                      "Po tej chwili klient może czytać ofertę, ale nie może jej zaakceptować.",
                    date: { pickerAppearance: "dayAndTime" },
                  },
                },
              ],
            },
            {
              name: "clientName",
              label: "Osoba kontaktowa",
              type: "text",
              required: true,
              maxLength: 160,
            },
            {
              name: "clientCompany",
              label: "Firma klienta",
              type: "text",
              maxLength: 200,
            },
            { name: "clientEmail", label: "E-mail klienta", type: "email" },
            {
              name: "clientDetails",
              label: "Dane klienta (adres, NIP)",
              type: "textarea",
              maxLength: 2000,
            },
            {
              name: "issuerName",
              label: "Wystawca",
              type: "text",
              required: true,
              maxLength: 160,
              defaultValue: "Wojciech Bajer",
            },
            {
              name: "issuerEmail",
              label: "E-mail wystawcy",
              type: "email",
              required: true,
            },
            {
              name: "issuerDetails",
              label: "Dane wystawcy (adres, NIP)",
              type: "textarea",
              maxLength: 2000,
            },
          ],
        },
        {
          label: "Zakres i warunki",
          fields: [
            {
              name: "summary",
              label: "Wprowadzenie i cel współpracy",
              type: "textarea",
              required: true,
              maxLength: 6000,
            },
            {
              name: "scope",
              label: "Zakres prac",
              type: "array",
              maxRows: 20,
              labels: { singular: "Sekcja", plural: "Sekcje" },
              fields: [
                {
                  name: "title",
                  label: "Nagłówek",
                  type: "text",
                  required: true,
                  maxLength: 180,
                },
                {
                  name: "body",
                  label: "Opis zakresu",
                  type: "textarea",
                  required: true,
                  maxLength: 6000,
                },
              ],
            },
            {
              name: "timeline",
              label: "Harmonogram",
              type: "array",
              maxRows: 20,
              labels: { singular: "Etap", plural: "Etapy" },
              fields: [
                {
                  name: "title",
                  label: "Etap",
                  type: "text",
                  required: true,
                  maxLength: 180,
                },
                {
                  name: "description",
                  label: "Opis",
                  type: "textarea",
                  required: true,
                  maxLength: 2000,
                },
                {
                  name: "duration",
                  label: "Czas lub termin",
                  type: "text",
                  required: true,
                  maxLength: 160,
                },
              ],
            },
            {
              name: "assumptions",
              label: "Założenia",
              type: "textarea",
              maxLength: 6000,
            },
            {
              name: "exclusions",
              label: "Poza zakresem",
              type: "textarea",
              maxLength: 6000,
            },
            {
              name: "paymentTerms",
              label: "Warunki płatności",
              type: "textarea",
              required: true,
              maxLength: 6000,
            },
            {
              name: "notes",
              label: "Uwagi końcowe",
              type: "textarea",
              maxLength: 6000,
            },
          ],
        },
        {
          label: "Pakiety i ceny",
          fields: [
            {
              name: "discountPercent",
              label: "Rabat (%)",
              type: "number",
              defaultValue: 0,
              min: 0,
              max: 100,
              admin: {
                step: 0.01,
                description:
                  "Rabat dotyczy każdej pozycji netto, również dodatków. Kwoty, rabat i VAT zaokrąglamy osobno dla każdej pozycji.",
              },
            },
            {
              name: "packages",
              label: "Pakiety do wyboru",
              type: "array",
              required: true,
              minRows: 1,
              maxRows: 5,
              labels: { singular: "Pakiet", plural: "Pakiety" },
              fields: [
                {
                  name: "name",
                  label: "Nazwa pakietu",
                  type: "text",
                  required: true,
                  maxLength: 120,
                },
                {
                  name: "description",
                  label: "Opis pakietu",
                  type: "textarea",
                  maxLength: 2000,
                },
                {
                  name: "recommended",
                  label: "Rekomendowany",
                  type: "checkbox",
                  defaultValue: false,
                },
                {
                  name: "items",
                  label: "Pozycje",
                  type: "array",
                  required: true,
                  minRows: 1,
                  maxRows: 50,
                  fields: itemFields(),
                },
              ],
            },
            {
              name: "addons",
              label: "Opcjonalne dodatki",
              type: "array",
              maxRows: 30,
              fields: itemFields(),
            },
          ],
        },
        {
          label: "Dostęp i decyzja klienta",
          fields: [
            {
              name: "publicId",
              label: "Identyfikator linku",
              type: "text",
              unique: true,
              index: true,
              access: serverWritten,
              admin: {
                readOnly: true,
                description:
                  "Link klienta: /quotes/{identyfikator}/. Przycisk podglądu otwiera wersję dla właściciela.",
              },
              hooks: {
                beforeDuplicate: [() => randomBytes(16).toString("hex")],
              },
            },
            {
              name: "shareTools",
              type: "ui",
              admin: {
                components: {
                  Field: "./cms/components/QuoteShareTools#QuoteShareTools",
                },
              },
            },
            {
              name: "password",
              label: "Nowe hasło dostępu",
              type: "text",
              virtual: true,
              // Payload hides fields without read access, even when they are
              // writable. Staff see an empty input; plaintext is never read back.
              access: { read: ({ req }) => req.user?.collection === "users" },
              hooks: { ...resetOnDuplicate, afterRead: [() => ""] },
              admin: {
                readOnly: false,
                autoComplete: "new-password",
                description:
                  "12–256 znaków. Pozostaw puste, aby zachować obecne hasło. Zmiana unieważnia dotychczasowe sesje klienta po publikacji.",
              },
            },
            {
              name: "passwordHash",
              type: "text",
              hidden: true,
              access: { ...serverWritten, read: () => false },
              hooks: resetOnDuplicate,
            },
            {
              name: "accessEnabled",
              label: "Dostęp klienta aktywny",
              type: "checkbox",
              defaultValue: true,
            },
            {
              name: "accessExpiresAt",
              label: "Wyłącz dostęp po (opcjonalnie)",
              type: "date",
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description:
                  "Osobny termin wygaśnięcia linku, niezależny od terminu ważności ceny. Zapisz przez publikację, aby zmiana dotyczyła klienta.",
              },
            },
            {
              name: "allowAcceptance",
              label: "Pozwól klientowi zaakceptować ofertę online",
              type: "checkbox",
              defaultValue: false,
              admin: {
                description:
                  "Zapisuje wybrany pakiet, dodatki, ceny i dokładną wersję warunków. Po akceptacji zmiana treści wymaga utworzenia kopii.",
              },
            },
            {
              name: "revision",
              label: "Wersja opublikowanych warunków",
              type: "text",
              access: serverWritten,
              hooks: resetOnDuplicate,
              admin: { readOnly: true },
            },
            {
              name: "acceptance",
              label: "Zarejestrowana akceptacja",
              type: "json",
              access: serverWritten,
              hooks: resetOnDuplicate,
              admin: {
                readOnly: true,
                description:
                  "Zapis decyzji klienta wraz z niezmienną kopią zaakceptowanych warunków.",
              },
            },
          ],
        },
      ],
    },
  ],
};
