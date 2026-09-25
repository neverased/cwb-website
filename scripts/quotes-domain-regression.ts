import assert from "node:assert/strict";

import { Quotes } from "../src/cms/collections/Quotes";
import {
  calculateQuote,
  defaultSelection,
} from "../src/lib/quotes/calculations";
import {
  createQuoteSession,
  hashQuotePassword,
  quoteRevision,
  verifyQuotePassword,
  verifyQuoteSession,
} from "../src/lib/quotes/credentials";
import {
  extractQuoteContent,
  formatQuoteMoney,
} from "../src/lib/quotes/presentation";
import type { QuoteContent } from "../src/lib/quotes/types";

const content: QuoteContent = {
  number: "WB/2026/001",
  title: "Projekt strony",
  language: "pl",
  currency: "PLN",
  clientName: "Anna Przykład",
  issuerName: "Wojciech Bajer",
  issuerEmail: "example@example.com",
  issuedAt: "2026-09-25T00:00:00.000Z",
  validUntil: "2026-10-25T23:59:59.000Z",
  summary: "Wdrożenie strony.",
  scope: [{ title: "Zakres", body: "Projekt i wdrożenie." }],
  timeline: [],
  paymentTerms: "50% zaliczki.",
  discountPercent: 10,
  packages: [
    {
      id: "standard",
      name: "Standard",
      items: [
        {
          id: "design",
          name: "Projekt",
          quantity: 1.5,
          unit: "h",
          unitPrice: 19.99,
          vatRate: 23,
        },
        {
          id: "copy",
          name: "Treść",
          quantity: 3,
          unit: "szt.",
          unitPrice: 0.05,
          vatRate: 8,
        },
      ],
    },
    {
      id: "complete",
      name: "Pełny",
      recommended: true,
      items: [
        {
          id: "delivery",
          name: "Wdrożenie",
          quantity: 1,
          unit: "projekt",
          unitPrice: 100,
          vatRate: 23,
        },
      ],
    },
  ],
  addons: [
    {
      id: "audit",
      name: "Audyt",
      quantity: 0.125,
      unit: "h",
      unitPrice: 40,
      vatRate: 0,
    },
  ],
};

const total = calculateQuote(content, {
  packageId: "standard",
  addonIds: ["audit"],
});
assert.deepEqual(
  total.lines.map(({ subtotal, discount, net, vat, gross }) => ({
    subtotal,
    discount,
    net,
    vat,
    gross,
  })),
  [
    { subtotal: 2999, discount: 300, net: 2699, vat: 621, gross: 3320 },
    { subtotal: 15, discount: 2, net: 13, vat: 1, gross: 14 },
    { subtotal: 500, discount: 50, net: 450, vat: 0, gross: 450 },
  ],
);
assert.deepEqual(
  {
    subtotal: total.subtotal,
    discount: total.discount,
    net: total.net,
    vat: total.vat,
    gross: total.gross,
  },
  { subtotal: 3514, discount: 352, net: 3162, vat: 622, gross: 3784 },
);
assert.deepEqual(defaultSelection(content), {
  packageId: "complete",
  addonIds: [],
});
assert.equal(
  calculateQuote(
    { ...content, discountPercent: 100 },
    { packageId: "standard", addonIds: [] },
  ).gross,
  0,
);
assert.throws(() =>
  calculateQuote(content, { packageId: "other", addonIds: [] }),
);
assert.throws(() =>
  calculateQuote(content, {
    packageId: "standard",
    addonIds: ["audit", "audit"],
  }),
);
assert.throws(() =>
  calculateQuote(content, { packageId: "standard", addonIds: ["other"] }),
);
assert.throws(() =>
  calculateQuote(
    { ...content, discountPercent: Number.NaN },
    defaultSelection(content),
  ),
);
for (const [key, value] of [
  ["quantity", -1],
  ["quantity", 0],
  ["quantity", 1.0001],
  ["unitPrice", 1.001],
  ["unitPrice", Infinity],
  ["vatRate", 100.01],
] as const) {
  const bad = structuredClone(content);
  bad.packages[0].items[0][key] = value;
  assert.throws(
    () => calculateQuote(bad, { packageId: "standard", addonIds: [] }),
    `${key}=${value} must be rejected`,
  );
}
const overflowing = structuredClone(content);
overflowing.packages[0].items = [
  {
    ...content.packages[0].items[0],
    quantity: 1_000_000,
    unitPrice: 1_000_000_000,
  },
];
assert.throws(() =>
  calculateQuote(overflowing, { packageId: "standard", addonIds: [] }),
);

const extracted = extractQuoteContent({
  ...content,
  password: "private",
  passwordHash: "private",
  acceptance: { private: true },
  internalNotes: "private",
});
assert.ok(!JSON.stringify(extracted).includes("private"));
assert.equal(
  quoteRevision(extracted),
  quoteRevision(
    extractQuoteContent({ ...content, id: 123, updatedAt: "later" }),
  ),
);
assert.notEqual(
  quoteRevision(extracted),
  quoteRevision({ ...extracted, title: "Nowe warunki" }),
);
assert.match(formatQuoteMoney(123456, "PLN", "pl"), /1.*234,56/);

const password = "Dobra oferta 2026!";
const hash = await hashQuotePassword(password);
assert.notEqual(hash, password);
assert.equal(await verifyQuotePassword(password, hash), true);
assert.equal(await verifyQuotePassword("wrong password", hash), false);
assert.equal(await verifyQuotePassword(password, "scrypt$malformed"), false);
assert.equal(await verifyQuotePassword("a".repeat(10_000), hash), false);
await assert.rejects(hashQuotePassword("short"));
const secondHash = await hashQuotePassword(password);
assert.notEqual(hash, secondHash, "Hashes use random salts");

const publicId = "a".repeat(32);
const secret = "test-secret-with-at-least-32-characters";
const now = 1_790_336_000_000;
const session = createQuoteSession(publicId, hash, secret, now);
assert.equal(verifyQuoteSession(session, publicId, hash, secret, now), true);
assert.equal(
  verifyQuoteSession(session, "b".repeat(32), hash, secret, now),
  false,
);
assert.equal(
  verifyQuoteSession(session, publicId, secondHash, secret, now),
  false,
);
assert.equal(
  verifyQuoteSession(session, publicId, hash, `${secret}-other`, now),
  false,
);
assert.equal(
  verifyQuoteSession(session, publicId, hash, secret, now + 8 * 60 * 60 * 1000),
  false,
);
assert.equal(
  verifyQuoteSession(session, publicId, hash, secret, now - 60_000),
  false,
);
for (const malformed of [
  "",
  "x",
  `${session}x`,
  "x".repeat(10_000),
  "a.b.c.d",
  "💣.test",
]) {
  assert.equal(
    verifyQuoteSession(malformed, publicId, hash, secret, now),
    false,
  );
}

const saveHook = Quotes.hooks!.beforeChange![0];
const runSave = async (
  data: Record<string, unknown>,
  originalDoc?: Record<string, unknown>,
  currentDoc?: Record<string, unknown>,
) =>
  saveHook({
    data,
    originalDoc,
    operation: originalDoc ? "update" : "create",
    collection: Quotes,
    req: { payload: { db: { findOne: async () => currentDoc ?? null } } },
  } as never);
const created = await runSave({
  ...content,
  _status: "published",
  password,
  publicId: "injected",
  passwordHash: "injected",
  revision: "injected",
  acceptance: { injected: true },
});
assert.match(created.publicId, /^[a-f0-9]{32}$/);
assert.equal(created.acceptance, null);
assert.equal(created.revision, quoteRevision(content));
assert.equal(created.password, undefined);
assert.equal(await verifyQuotePassword(password, created.passwordHash), true);
await assert.rejects(
  runSave({ ...content, _status: "published", passwordHash: hash }),
  /hasło/,
);
const original = { ...created, id: 123 };
const updated = await runSave(
  {
    ...content,
    _status: "published",
    publicId: "injected",
    passwordHash: "injected",
    revision: "injected",
    acceptance: { injected: true },
  },
  original,
);
assert.equal(updated.publicId, created.publicId);
assert.equal(updated.passwordHash, created.passwordHash);
assert.equal(updated.acceptance, null);
const accepted = {
  ...original,
  acceptance: {
    revision: created.revision,
    acceptedAt: "2026-09-25T12:00:00Z",
  },
};
await assert.rejects(
  runSave(
    { ...content, title: "Changed after acceptance", _status: "published" },
    accepted,
  ),
  /zamknięta/,
);
await assert.rejects(
  runSave(
    {
      ...content,
      title: "Old draft changed after acceptance",
      _status: "draft",
    },
    original,
    accepted,
  ),
  /zamknięta/,
);
const revoked = await runSave(
  {
    ...content,
    _status: "published",
    accessEnabled: false,
    password: "Rotated password 2026!",
  },
  accepted,
);
assert.equal(revoked.accessEnabled, false);
assert.deepEqual(revoked.acceptance, accepted.acceptance);
assert.notEqual(revoked.passwordHash, accepted.passwordHash);
const partial = await runSave({ title: "Incomplete draft", _status: "draft" });
assert.equal(partial.revision, null);
assert.equal(partial.passwordHash, null);
await assert.rejects(
  runSave({
    title: "Oversized draft",
    _status: "draft",
    summary: "x".repeat(6001),
  }),
  /6000/,
);
const duplicateArgs = {
  data: { _status: "published", password },
  duplicateFromID: 123,
  draft: false,
};
await Quotes.hooks!.beforeOperation![0]({
  args: duplicateArgs,
  operation: "create",
} as never);
assert.equal(duplicateArgs.draft, true);
assert.equal(duplicateArgs.data._status, "draft");
assert.ok(!("password" in duplicateArgs.data));
assert.equal(
  await Quotes.access!.read!({
    req: { user: { collection: "users" } },
  } as never),
  true,
);
assert.equal(
  await Quotes.access!.read!({ req: { user: null } } as never),
  false,
);
assert.equal(
  await Quotes.access!.readVersions!({
    req: { user: { collection: "clients" } },
  } as never),
  false,
);
const quoteTabs = Quotes.fields.find((field) => field.type === "tabs");
assert(quoteTabs?.type === "tabs");
const passwordField = quoteTabs.tabs
  .flatMap((tab) => tab.fields)
  .find((field) => "name" in field && field.name === "password");
assert(passwordField?.type === "text");
assert.equal(
  passwordField.virtual,
  true,
  "The password input never gets a database column",
);
assert.equal(
  passwordField.admin?.readOnly,
  false,
  "Virtual fields must explicitly opt out of Payload's default read-only UI",
);
assert.equal(
  await passwordField.access!.read!({
    req: { user: { collection: "users" } },
  } as never),
  true,
  "Staff need read permission for Payload to render the editable password input",
);
assert.equal(
  await passwordField.access!.read!({ req: { user: null } } as never),
  false,
);
assert.equal(
  await passwordField.hooks!.afterRead![0]({ value: password } as never),
  "",
  "Even privileged reads expose only an empty password input",
);
const currentAcceptance = {
  revision: created.revision,
  name: "Klient",
  acceptedAt: "2026-09-25T12:00:00Z",
};
let acceptanceReads = 0;
const readHook = Quotes.hooks!.afterRead![0];
const readArgs = {
  collection: Quotes,
  req: {
    payload: {
      db: {
        findOne: async () => {
          acceptanceReads++;
          return {
            ...original,
            passwordHash: hash,
            password: "MUST-NOT-LEAK",
            acceptance: currentAcceptance,
          };
        },
      },
    },
  },
};
const draftWithAcceptance = await readHook({
  ...readArgs,
  doc: { id: original.id, title: "Existing draft", acceptance: null },
} as never);
assert.deepEqual(
  draftWithAcceptance.acceptance,
  currentAcceptance,
  "Admin draft read shows acceptance recorded on main row",
);
assert.equal(
  draftWithAcceptance.title,
  "Existing draft",
  "Only acceptance is overlaid",
);
assert.ok(!("passwordHash" in draftWithAcceptance));
assert.ok(!("password" in draftWithAcceptance));
const historicalVersion = { title: "Historical version", acceptance: null };
assert.deepEqual(
  await readHook({ ...readArgs, doc: historicalVersion } as never),
  historicalVersion,
  "Historical version payload excludes the main document id and must not be overlaid",
);
assert.equal(
  acceptanceReads,
  1,
  "Historical versions do not query or inherit current acceptance",
);
console.log(
  "Quote domain regression passed: money rounding, selection bounds, public allowlist, credential scope/rotation/expiry, CMS injection guards, draft bounds, duplicate reset and accepted-content freeze.",
);
