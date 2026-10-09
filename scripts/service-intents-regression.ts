import assert from "node:assert/strict";

import {
  resolveServiceIntent,
  serviceExplorerHref,
  serviceIntents,
  serviceSelectionUrl,
} from "../src/lib/service_intents";
import { contactHref } from "../src/lib/services";
import { services } from "../src/static/siteContent";

const expectedIntents = {
  audits: "review",
  architecture: "review",
  software: "build",
  multimedia: "build",
  ai: "build",
  fractional: "direction",
} as const;

for (const [serviceId, intentId] of Object.entries(expectedIntents)) {
  const { service, intent } = resolveServiceIntent(serviceId);
  assert.equal(
    service.id,
    serviceId,
    "Existing service URLs retain their selection",
  );
  assert.equal(intent.id, intentId, "Every service opens its matching need");
  assert.ok(intent.serviceIds.includes(service.id));
  assert.equal(contactHref(service.id), `/contact/?service=${serviceId}`);
  assert.equal(
    serviceExplorerHref(service.id, true),
    `/?service=${serviceId}#service-explorer`,
  );
  assert.equal(
    serviceExplorerHref(service.id, false),
    `/services/#${serviceId}`,
  );
}

const mappedServices = serviceIntents.flatMap((intent) => intent.serviceIds);
assert.deepEqual(
  [...mappedServices].sort(),
  services.map(({ id }) => id).sort(),
);
assert.equal(
  new Set(mappedServices).size,
  services.length,
  "No specialty is mapped twice",
);
assert.deepEqual(
  serviceIntents.map(({ defaultServiceId }) => defaultServiceId),
  ["audits", "software", "fractional"],
);

for (const value of [null, undefined, "", "unknown", "AI", "<script>"]) {
  const { service, intent } = resolveServiceIntent(value);
  assert.equal(
    service.id,
    "audits",
    "Missing or invalid selections use the review default",
  );
  assert.equal(intent.id, "review");
}

const selection = serviceSelectionUrl(
  "https://example.com/?utm_source=referral&service=audits#contact",
  "ai",
);
assert.equal(selection.pathname, "/");
assert.equal(selection.searchParams.get("utm_source"), "referral");
assert.deepEqual(selection.searchParams.getAll("service"), ["ai"]);
assert.equal(selection.hash, "#service-explorer");
assert.equal(
  resolveServiceIntent(selection.searchParams.get("service")).intent.id,
  "build",
);

console.log(
  "Service intent regressions passed: all six specialties, defaults, contact and explorer URLs.",
);
