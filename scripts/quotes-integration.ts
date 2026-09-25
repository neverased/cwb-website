import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

const base = new URL(process.env.CMS_TEST_URL || "http://127.0.0.1:3111");
assert(
  ["127.0.0.1", "localhost"].includes(base.hostname),
  "Quote integration tests only run locally",
);
assert.equal(
  process.env.CMS_TEST_ALLOW_WRITES,
  "1",
  "A disposable local CMS is required",
);
const email = process.env.CMS_TEST_EMAIL;
const adminPassword = process.env.CMS_TEST_PASSWORD;
assert(email && adminPassword, "Set disposable CMS_TEST_EMAIL/PASSWORD");
const nonce = randomBytes(6).toString("hex");
const password = `Quote-access-${nonce}!`;
let token = "";
const ids: number[] = [];

async function request(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    staff?: boolean;
    cookie?: string;
    origin?: string;
  } = {},
) {
  return fetch(new URL(path, base), {
    method: options.method || "GET",
    headers: {
      ...(options.body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...(options.staff ? { Authorization: `JWT ${token}` } : {}),
      ...(options.cookie ? { Cookie: options.cookie } : {}),
      Origin: options.origin ?? base.origin,
    },
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
    signal: AbortSignal.timeout(90_000),
  });
}

async function json(response: Response, status = 200) {
  const value = await response.text();
  assert.equal(
    response.status,
    status,
    `${response.url}: ${value.slice(0, 1500)}`,
  );
  return JSON.parse(value);
}

function fixture(number: string) {
  return {
    number,
    title: `Prywatna oferta ${nonce}`,
    language: "pl",
    currency: "PLN",
    clientName: `Żaneta Łącka ${nonce}`,
    clientCompany: "Studio Przykład",
    clientEmail: "client@example.test",
    issuerName: "Wojciech Bajer",
    issuerEmail: "mail@wojciechbajer.com",
    issuedAt: new Date(Date.now() - 86400_000).toISOString(),
    validUntil: new Date(Date.now() + 86400_000 * 14).toISOString(),
    summary: "Przemyślana strona i wygodna obsługa treści.",
    scope: [{ title: "Zakres", body: "Projekt, wdrożenie i testy." }],
    timeline: [
      {
        title: "Przygotowanie",
        description: "Warsztat i projekt.",
        duration: "2 tygodnie",
      },
    ],
    paymentTerms: "50% przed rozpoczęciem, 50% po odbiorze.",
    packages: [
      {
        name: "Kompletny",
        recommended: true,
        items: [
          {
            name: "Warsztat",
            quantity: 2.5,
            unit: "godz.",
            unitPrice: 100,
            vatRate: 23,
          },
          {
            name: "Wdrożenie",
            quantity: 1,
            unit: "projekt",
            unitPrice: 1000,
            vatRate: 23,
          },
        ],
      },
      {
        name: "Konsultacja",
        items: [
          {
            name: "Konsultacja",
            quantity: 1,
            unit: "godz.",
            unitPrice: 100,
            vatRate: 23,
          },
        ],
      },
    ],
    addons: [
      {
        name: "Szkolenie",
        quantity: 1,
        unit: "szt.",
        unitPrice: 200,
        vatRate: 8,
      },
    ],
    discountPercent: 10,
    password,
    accessEnabled: true,
    allowAcceptance: true,
  };
}

async function create(number: string, status = "draft") {
  const { doc } = await json(
    await request("/api/cms/quotes/", {
      method: "POST",
      staff: true,
      body: { ...fixture(number), _status: status },
    }),
    201,
  );
  ids.push(doc.id);
  return doc;
}
async function patch(id: number, body: unknown, suffix = "") {
  return (
    await json(
      await request(`/api/cms/quotes/${id}/${suffix}`, {
        method: "PATCH",
        staff: true,
        body,
      }),
    )
  ).doc;
}
async function unlock(publicId: string, pass = password) {
  const response = await request(`/api/quotes/${publicId}/unlock/`, {
    method: "POST",
    body: { password: pass },
  });
  await json(response);
  const cookie = response.headers.get("set-cookie");
  assert(cookie?.includes("HttpOnly"));
  assert(cookie?.includes("SameSite=lax"));
  return cookie!.split(";")[0];
}

try {
  await json(await request("/api/health/"));
  const login = await request("/api/cms/users/login/", {
    method: "POST",
    body: { email, password: adminPassword },
  });
  if (login.status !== 200) {
    await json(
      await request("/api/cms/users/first-register/", {
        method: "POST",
        body: { email, password: adminPassword },
      }),
    );
    token = (
      await json(
        await request("/api/cms/users/login/", {
          method: "POST",
          body: { email, password: adminPassword },
        }),
      )
    ).token;
  } else token = (await login.json()).token;
  assert(token);

  let doc = await create(`TEST/${nonce}`);
  assert.match(doc.publicId, /^[a-f0-9]{32}$/);
  assert(
    !JSON.stringify(doc).includes(password),
    "Plain password must not be returned",
  );
  for (const path of [
    "/api/cms/quotes/",
    `/api/cms/quotes/${doc.id}/`,
    "/api/cms/quotes/versions/",
  ]) {
    assert(
      [401, 403].includes((await request(path)).status),
      `CMS data private: ${path}`,
    );
  }
  assert.equal(
    (
      await request(`/api/quotes/${doc.publicId}/unlock/`, {
        method: "POST",
        body: { password },
      })
    ).status,
    401,
  );
  let html = await (await request(`/quotes/${doc.publicId}/`)).text();
  assert(
    !html.includes(doc.title) && !html.includes(doc.clientName),
    "Draft must not leak through HTML/RSC",
  );
  assert.equal((await request(`/api/quotes/${doc.publicId}/pdf/`)).status, 401);
  const preview = await (
    await request(`/quotes/${doc.publicId}/?preview=1`, { staff: true })
  ).text();
  assert(preview.includes(doc.title), "Staff can preview a complete draft");
  assert(
    !(
      await (await request(`/quotes/${doc.publicId}/?preview=1`)).text()
    ).includes(doc.title),
  );
  console.log("PASS: CMS privacy, draft protection and staff-only preview");

  doc = await patch(doc.id, { _status: "published" });
  const initialRevision = doc.revision;
  assert.equal(
    (
      await request(`/api/quotes/${doc.publicId}/unlock/`, {
        method: "POST",
        body: { password },
        origin: "https://attacker.example",
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request(`/api/quotes/${doc.publicId}/unlock/`, {
        method: "POST",
        body: { password: "wrong-password" },
      })
    ).status,
    401,
  );
  let cookie = await unlock(doc.publicId);
  const page = await request(`/quotes/${doc.publicId}/`, { cookie });
  html = await page.text();
  assert(html.includes(doc.title) && html.includes(doc.clientName));
  assert(
    !html.includes("passwordHash") &&
      !html.includes(password) &&
      !html.includes("scrypt$"),
  );
  const pageCache = page.headers.get("cache-control") || "";
  assert(
    pageCache.includes("no-store") ||
      (process.env.CMS_TEST_DEV === "1" && pageCache.includes("no-cache")),
    "Production pages must use no-store; Next dev forcibly uses no-cache",
  );
  assert(page.headers.get("x-robots-tag")?.includes("noindex"));
  const selection = {
    packageId: doc.packages[0].id,
    addonIds: [doc.addons[0].id],
  };
  const pdfPath = `/api/quotes/${doc.publicId}/pdf/?packageId=${selection.packageId}&addonId=${selection.addonIds[0]}`;
  const pdf = await request(pdfPath, { cookie });
  assert.equal(pdf.status, 200);
  assert.equal(pdf.headers.get("content-type"), "application/pdf");
  assert(pdf.headers.get("cache-control")?.includes("no-store"));
  assert.equal(
    Buffer.from(await pdf.arrayBuffer())
      .subarray(0, 5)
      .toString(),
    "%PDF-",
  );
  assert.equal(
    (
      await request(`/api/quotes/${doc.publicId}/pdf/?packageId=forged`, {
        cookie,
      })
    ).status,
    400,
  );
  assert.equal((await request(pdfPath)).status, 401);
  const other = await create(`OTHER/${nonce}`, "published");
  assert(
    !(
      await (await request(`/quotes/${other.publicId}/`, { cookie })).text()
    ).includes(other.clientName),
  );
  assert.equal(
    (await request(`/api/quotes/${other.publicId}/pdf/`, { cookie })).status,
    401,
  );
  console.log(
    "PASS: password access, cache/metadata protection, selection and protected PDF",
  );

  await patch(
    doc.id,
    { summary: "UNPUBLISHED-PRIVATE-CHANGE", _status: "draft" },
    "?draft=true",
  );
  html = await (await request(`/quotes/${doc.publicId}/`, { cookie })).text();
  assert(
    !html.includes("UNPUBLISHED-PRIVATE-CHANGE"),
    "Saved draft must not replace published content",
  );
  doc = await patch(doc.id, {
    summary: "PUBLISHED-NEW-CONTENT",
    _status: "published",
  });
  assert.notEqual(doc.revision, initialRevision);
  const decision = {
    ...selection,
    name: "Żaneta Łącka",
    email: "client@example.test",
    consent: true,
    revision: initialRevision,
  };
  const acceptPath = `/api/quotes/${doc.publicId}/accept/`;
  assert.equal(
    (await request(acceptPath, { method: "POST", cookie, body: decision }))
      .status,
    409,
  );
  decision.revision = doc.revision;
  assert.equal(
    (
      await request(acceptPath, {
        method: "POST",
        cookie,
        body: { ...decision, addonIds: ["forged"] },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request(acceptPath, {
        method: "POST",
        cookie,
        body: { ...decision, consent: false },
      })
    ).status,
    400,
  );
  const rotated = `${password}-rotated`;
  doc = await patch(doc.id, { password: rotated, _status: "published" });
  assert.equal((await request(pdfPath, { cookie })).status, 401);
  cookie = await unlock(doc.publicId, rotated);
  doc = await patch(doc.id, {
    accessExpiresAt: new Date(Date.now() - 60_000).toISOString(),
    _status: "published",
  });
  assert.equal((await request(pdfPath, { cookie })).status, 401);
  doc = await patch(doc.id, {
    accessExpiresAt: null,
    validUntil: new Date(Date.now() - 60_000).toISOString(),
    _status: "published",
  });
  decision.revision = doc.revision;
  assert.equal(
    (await request(acceptPath, { method: "POST", cookie, body: decision }))
      .status,
    409,
  );
  doc = await patch(doc.id, {
    validUntil: new Date(Date.now() + 86400_000).toISOString(),
    _status: "published",
  });
  decision.revision = doc.revision;
  console.log(
    "PASS: draft separation, revision checks, password rotation and separate expiries",
  );

  const results = await Promise.all(
    [1, 2].map(() =>
      request(acceptPath, { method: "POST", cookie, body: decision }),
    ),
  );
  assert.deepEqual(
    results.map((r) => r.status).sort(),
    [200, 409],
    "Exactly one concurrent acceptance wins",
  );
  doc = await json(
    await request(`/api/cms/quotes/${doc.id}/`, { staff: true }),
  );
  assert.equal(doc.acceptance.totals.net, 130500);
  assert.equal(doc.acceptance.totals.vat, 27315);
  assert.equal(doc.acceptance.totals.gross, 157815);
  assert.equal(doc.acceptance.revision, decision.revision);
  assert.equal(doc.acceptance.snapshot.summary, "PUBLISHED-NEW-CONTENT");
  const draftWithAcceptance = await json(
    await request(`/api/cms/quotes/${doc.id}/?draft=true`, { staff: true }),
  );
  assert.deepEqual(
    draftWithAcceptance.acceptance,
    doc.acceptance,
    "CMS draft view immediately shows the recorded acceptance",
  );
  const historical = await json(
    await request(
      `/api/cms/quotes/versions/?where[parent][equals]=${doc.id}&limit=100`,
      { staff: true },
    ),
  );
  assert(
    historical.docs.every(
      (version: { version: { acceptance?: unknown } }) =>
        !version.version.acceptance,
    ),
    "Reading historical versions must not insert future acceptance",
  );
  const edit = await request(`/api/cms/quotes/${doc.id}/`, {
    method: "PATCH",
    staff: true,
    body: { title: "CHANGED AFTER ACCEPTANCE", _status: "published" },
  });
  assert([400, 409].includes(edit.status), "Accepted content is immutable");
  await patch(doc.id, { accessEnabled: false, _status: "published" });
  assert.equal((await request(pdfPath, { cookie })).status, 401);
  await patch(doc.id, { accessEnabled: true, _status: "published" });
  const acceptedPdf = await request(
    `/api/quotes/${doc.publicId}/pdf/?packageId=forged`,
    { cookie },
  );
  assert.equal(
    acceptedPdf.status,
    200,
    "Accepted PDF always uses accepted configuration",
  );
  const duplicateResponse = await request(
    `/api/cms/quotes/${doc.id}/duplicate/`,
    { method: "POST", staff: true, body: {} },
  );
  const duplicate = (await json(duplicateResponse)).doc;
  ids.push(duplicate.id);
  assert.notEqual(duplicate.publicId, doc.publicId);
  assert(!duplicate.acceptance);
  assert.equal(duplicate._status, "draft");
  assert.equal(
    (
      await request(`/api/quotes/${duplicate.publicId}/unlock/`, {
        method: "POST",
        body: { password: rotated },
      })
    ).status,
    401,
  );
  console.log(
    "PASS: atomic acceptance, exact stored prices/snapshot, frozen content and clean duplication",
  );

  const limited = await create(`LIMIT/${nonce}`, "published");
  for (let i = 0; i < 10; i++) {
    assert.equal(
      (
        await request(`/api/quotes/${limited.publicId}/unlock/`, {
          method: "POST",
          body: { password: "wrong-password" },
        })
      ).status,
      401,
    );
  }
  const denied = await request(`/api/quotes/${limited.publicId}/unlock/`, {
    method: "POST",
    body: { password },
  });
  assert.equal(denied.status, 429);
  assert(Number(denied.headers.get("retry-after")) > 0);
  const versions = await json(
    await request(
      `/api/cms/quotes/versions/?where[parent][equals]=${doc.id}&limit=100`,
      { staff: true },
    ),
  );
  assert(
    !JSON.stringify(versions).includes(password),
    "Plain passwords are absent from version history",
  );
  const logout = await request(`/api/quotes/${doc.publicId}/lock/`, {
    method: "POST",
    cookie,
  });
  assert.equal(logout.status, 200);
  assert(logout.headers.get("set-cookie")?.includes("Max-Age=0"));
  console.log(
    "PASS: durable throttling, password history protection and session logout",
  );
} finally {
  for (const id of ids.reverse()) {
    const result = await request(`/api/cms/quotes/${id}/`, {
      method: "DELETE",
      staff: true,
    });
    assert.equal(result.status, 200, `Cleanup of test quote ${id}`);
  }
}
