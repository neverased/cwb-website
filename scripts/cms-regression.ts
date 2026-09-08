import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

import type { Media, Post } from "../src/payload-types";

const base = new URL(process.env.CMS_TEST_URL || "http://127.0.0.1:3100");
assert(
  ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname),
  "CMS tests may only write to a local test stack",
);
assert.equal(
  process.env.CMS_TEST_ALLOW_WRITES,
  "1",
  "Set CMS_TEST_ALLOW_WRITES=1 for a disposable local CMS",
);
const nonce = randomBytes(8).toString("hex");
const bootstrap = process.env.CMS_TEST_BOOTSTRAP === "1";
const email = bootstrap
  ? `cms-test-${nonce}@example.test`
  : process.env.CMS_TEST_EMAIL;
const password = bootstrap
  ? randomBytes(32).toString("hex")
  : process.env.CMS_TEST_PASSWORD;
assert(
  email && password,
  "Provide CMS_TEST_EMAIL/PASSWORD or opt in to CMS_TEST_BOOTSTRAP=1 on an empty database",
);
let token = "";
let userId: number | undefined;
const postIds: number[] = [];
let mediaId: number | undefined;

const request = (
  path: string,
  method = "GET",
  data?: unknown,
  authenticated = false,
) =>
  fetch(new URL(path, base), {
    method,
    headers: {
      ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(authenticated ? { Authorization: `JWT ${token}` } : {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
    signal: AbortSignal.timeout(30000),
  });

const json = async <T>(response: Response, expected = 200): Promise<T> => {
  const body = await response.text();
  assert.equal(
    response.status,
    expected,
    `Unexpected status for ${response.url}`,
  );
  return JSON.parse(body) as T;
};

const textContent = (text: string) => ({
  root: {
    type: "root",
    version: 1,
    format: "",
    indent: 0,
    direction: null,
    children: [
      {
        type: "paragraph",
        version: 1,
        format: "",
        indent: 0,
        direction: null,
        children: [
          {
            type: "text",
            version: 1,
            text,
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
          },
        ],
        textFormat: 0,
        textStyle: "",
      },
    ],
  },
});

const slug = `cms-regression-${nonce}`;
const draftTitle = `Private draft ${nonce}`;
const publishedTitle = `Published note ${nonce}`;
const bodyText = `Public content ${nonce}`;

try {
  await json(await request("/api/health/"));
  for (const path of [
    "/",
    "/services/",
    "/profile/",
    "/process/",
    "/contact/",
    "/notes/",
  ]) {
    const page = await request(path);
    assert.equal(
      page.status,
      200,
      `Existing page ${path} should stay available`,
    );
    const html = await page.text();
    const image = html.match(/property="og:image" content="([^"]+)"/);
    assert(image, `Missing social image on ${path}`);
    const imagePath = new URL(image[1]).pathname;
    assert.equal(
      (await request(imagePath)).status,
      200,
      `Broken social image on ${path}: ${imagePath}`,
    );
  }
  assert.equal((await request("/api/contact/bootstrap/")).status, 200);
  console.log("PASS: existing pages, social images and contact bootstrap");
  if (bootstrap) {
    const registration = await json<{ user: { id: number } }>(
      await request("/api/cms/users/first-register/", "POST", {
        email,
        password,
      }),
      200,
    );
    userId = registration.user.id;
  }
  const login = await json<{ token: string }>(
    await request("/api/cms/users/login/", "POST", { email, password }),
  );
  token = login.token;
  assert(token);

  for (const collection of ["posts", "media", "users"]) {
    const denied = await request(`/api/cms/${collection}/`, "POST", {
      title: "Unauthorized",
      email: "denied@example.test",
      password,
    });
    assert(
      [401, 403].includes(denied.status),
      `Anonymous ${collection} creation must be denied`,
    );
  }
  assert(
    [401, 403].includes((await request("/api/cms/users/")).status),
    "User list must be private",
  );

  const draft = await json<{ doc: Post }>(
    await request(
      "/api/cms/posts/?draft=true",
      "POST",
      {
        title: draftTitle,
        slug,
        excerpt: "Test excerpt",
        content: textContent(bodyText),
        _status: "draft",
      },
      true,
    ),
    201,
  );
  postIds.push(draft.doc.id);
  const id = draft.doc.id;
  const publicList = await json<{ docs: Post[] }>(
    await request("/api/cms/posts/"),
  );
  assert(
    !publicList.docs.some((post) => post.id === id),
    "Draft leaked through REST list",
  );
  assert.equal(
    (await request(`/notes/${slug}/`)).status,
    404,
    "Draft page must return 404",
  );
  assert(
    !(await (await request("/sitemap.xml")).text()).includes(slug),
    "Draft leaked through sitemap",
  );
  const forcedDraft = await json<{ docs: Post[] }>(
    await request("/api/cms/posts/?draft=true"),
  );
  assert(
    !forcedDraft.docs.some((post) => post.id === id),
    "Anonymous draft=true must not reveal a draft",
  );
  for (const method of ["PATCH", "DELETE"]) {
    assert(
      [401, 403].includes(
        (
          await request(
            `/api/cms/posts/${id}/`,
            method,
            method === "PATCH" ? { title: "Unauthorized" } : undefined,
          )
        ).status,
      ),
    );
  }
  console.log("PASS: authentication, write permissions and draft privacy");

  const upload = new FormData();
  upload.set("_payload", JSON.stringify({ alt: `Test image ${nonce}` }));
  upload.set(
    "file",
    new Blob(
      [
        Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=",
          "base64",
        ),
      ],
      { type: "image/png" },
    ),
    `cms-test-${nonce}.png`,
  );
  const media = await json<{ doc: Media }>(
    await fetch(new URL("/api/cms/media/", base), {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: upload,
    }),
    201,
  );
  mediaId = media.doc.id;
  assert(media.doc.url);
  assert.equal(
    (await request(media.doc.url)).status,
    200,
    "Uploaded file must be available",
  );

  const published = await json<{ doc: Post }>(
    await request(
      `/api/cms/posts/${id}/`,
      "PATCH",
      {
        title: publishedTitle,
        _status: "published",
        coverImage: mediaId,
      },
      true,
    ),
  );
  assert(published.doc.publishedAt, "First publication should set its date");
  assert.equal(
    published.doc.slug,
    slug,
    "Changing the title should preserve the URL",
  );
  const article = await request(`/notes/${slug}/`);
  assert.equal(article.status, 200);
  const html = await article.text();
  assert(
    html.includes(publishedTitle) &&
      html.includes(bodyText) &&
      html.includes(media.doc.url),
    "Published article, content and image must render",
  );
  assert(
    (await (await request("/notes/")).text()).includes(publishedTitle),
    "Published post missing from listing",
  );
  assert(
    (await (await request("/sitemap.xml")).text()).includes(slug),
    "Published post missing from sitemap",
  );
  console.log(
    "PASS: upload, publication, article rendering, list and sitemap without a rebuild",
  );

  if (process.env.CMS_TEST_RESTART_PROJECT) {
    const project = process.env.CMS_TEST_RESTART_PROJECT;
    const context = process.env.CMS_TEST_DOCKER_CONTEXT || "default";
    assert(
      /^cwb-cms-test(?:-[a-z0-9]+)?$/.test(project),
      "Restart is restricted to a cwb-cms-test project",
    );
    assert(
      ["default", "desktop-linux"].includes(context),
      "Restart is restricted to a local Docker context",
    );
    const originalImage = Buffer.from(
      await (await request(media.doc.url)).arrayBuffer(),
    );
    execFileSync(
      "docker",
      ["--context", context, "compose", "-p", project, "restart", "db", "web"],
      { stdio: "pipe", timeout: 30000 },
    );
    let ready = false;
    for (let attempt = 0; attempt < 45; attempt++) {
      try {
        ready = (await request("/api/health/")).ok;
      } catch {
        ready = false;
      }
      if (ready) break;
      await delay(1000);
    }
    assert(ready, "Stack failed to recover after restart");
    const persisted = await json<{ title: string }>(
      await request(`/api/cms/posts/${id}/`, "GET", undefined, true),
    );
    assert.equal(
      persisted.title,
      publishedTitle,
      "Published content did not survive restart",
    );
    const persistedImage = await request(media.doc.url);
    assert.equal(persistedImage.status, 200);
    assert.deepEqual(
      Buffer.from(await persistedImage.arrayBuffer()),
      originalImage,
      "Uploaded image did not survive restart",
    );
    console.log(
      "PASS: database, login session and image survive a Compose restart",
    );
  }

  const unpublishedTitle = `Private revision ${nonce}`;
  await json(
    await request(
      `/api/cms/posts/${id}/?draft=true`,
      "PATCH",
      { title: unpublishedTitle, _status: "draft" },
      true,
    ),
  );
  const revisionHtml = await (await request(`/notes/${slug}/`)).text();
  assert(
    revisionHtml.includes(publishedTitle) &&
      !revisionHtml.includes(unpublishedTitle),
    "Saving a revision must keep the published version visible",
  );
  const anonymousRevision = await json<{ docs: Post[] }>(
    await request(`/api/cms/posts/?draft=true&where[id][equals]=${id}`),
  );
  assert(
    !anonymousRevision.docs.some((post) => post.title === unpublishedTitle),
    "Private revision leaked through draft=true",
  );

  const collision = await request(
    "/api/cms/posts/",
    "POST",
    {
      title: "Duplicate",
      slug,
      excerpt: "Duplicate",
      content: textContent("Duplicate"),
      _status: "published",
    },
    true,
  );
  assert.equal(collision.status, 400, "Duplicate slugs must fail validation");
  const invalidSlug = await request(
    `/api/cms/posts/${id}/`,
    "PATCH",
    { slug: "../bad-path", _status: "published" },
    true,
  );
  assert.equal(invalidSlug.status, 400, "Invalid slugs must fail validation");

  const unsafeTitle = `Safe text </script><script>alert("${nonce}")</script>`;
  await json(
    await request(
      `/api/cms/posts/${id}/`,
      "PATCH",
      { title: unsafeTitle, _status: "published" },
      true,
    ),
  );
  const unsafeHtml = await (await request(`/notes/${slug}/`)).text();
  assert(
    !unsafeHtml.includes(`</script><script>alert("${nonce}")</script>`),
    "CMS title must not break out of JSON-LD",
  );

  await json(
    await request(`/api/cms/posts/${id}/`, "PATCH", { _status: "draft" }, true),
  );
  assert.equal(
    (await request(`/notes/${slug}/`)).status,
    404,
    "Unpublished post must disappear immediately",
  );
  assert(
    !(await (await request("/sitemap.xml")).text()).includes(slug),
    "Unpublished post must leave sitemap",
  );
  assert.equal((await request("/notes/?page=99999")).status, 404);
  assert.equal((await request("/notes/?page=invalid")).status, 404);
  console.log(
    "PASS: private revisions, unique/valid URLs, safe JSON-LD, unpublish and pagination bounds",
  );
} finally {
  for (const id of postIds) {
    await json(
      await request(`/api/cms/posts/${id}/`, "DELETE", undefined, true),
    );
  }
  if (mediaId)
    await json(
      await request(`/api/cms/media/${mediaId}/`, "DELETE", undefined, true),
    );
  if (userId)
    await json(
      await request(`/api/cms/users/${userId}/`, "DELETE", undefined, true),
    );
}
console.log("CMS regression checks passed; test records removed.");
