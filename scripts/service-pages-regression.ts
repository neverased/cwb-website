import assert from "node:assert/strict";

import {
  findServicePage,
  servicePages,
  servicePath,
} from "../src/lib/service_pages";
import { contactHref } from "../src/lib/services";
import { services } from "../src/static/siteContent";

const expectedPaths = {
  multimedia: "/services/multimedia-consulting/",
  software: "/services/software-engineering/",
  architecture: "/services/software-architecture/",
  audits: "/services/technical-audits/",
  fractional: "/services/fractional-cto/",
  ai: "/services/ai-llm-engineering/",
} as const;

assert.deepEqual(
  servicePages.map(({ id }) => id).sort(),
  services.map(({ id }) => id).sort(),
  "Each existing specialty has exactly one landing page",
);

for (const field of ["slug", "title", "description", "heading"] as const) {
  assert.equal(
    new Set(servicePages.map((page) => page[field])).size,
    servicePages.length,
    `Service pages have distinct ${field} values`,
  );
}

for (const page of servicePages) {
  assert.equal(servicePath(page.id), expectedPaths[page.id]);
  assert.equal(servicePath(page.id), `/services/${page.slug}/`);
  assert.equal(findServicePage(page.slug), page);
  assert.equal(contactHref(page.id), `/contact/?service=${page.id}`);
  assert.ok(page.introduction && page.fit && page.preparation);
  assert.ok(page.scope.length && page.questions.length);
  assert.ok(page.questions.every(({ question, answer }) => question && answer));
  assert.ok(page.relatedServiceIds.length);
  for (const relatedId of page.relatedServiceIds) {
    assert.notEqual(relatedId, page.id);
    assert.ok(servicePages.some(({ id }) => id === relatedId));
  }
}

for (const slug of [
  "",
  "unknown",
  "AI",
  "../technical-audits",
  "technical-audits/",
]) {
  assert.equal(
    findServicePage(slug),
    undefined,
    "Unknown slugs cannot resolve to a service page",
  );
}

console.log(
  "Service page regressions passed: six unique routes, content mapping, related services and existing contact intents.",
);
