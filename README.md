# WojciechBajer.com Source Code

This is the source code for the personal website located at [www.wojciechbajer.com](https://wojciechbajer.com).

## Description

This repository contains the code for my personal website, which serves as my online portfolio and blog.

## Stack and quick start

Next.js 16 serves the website, Payload 3 admin panel and CMS REST API from one
Node.js 26 container. PostgreSQL 17 runs alongside it in the same Docker Compose
project. The frontend retains the existing design under the `(frontend)` route
group; `(payload)` has its own root layout and styles.

Use Node.js 26 and the pnpm version from `package.json` (currently 12.3.4):

```bash
pnpm install --frozen-lockfile
pnpm cms:setup
docker compose up --build -d --wait
```

`cms:setup` creates a gitignored `.env` with random secrets and owner-only
permissions. It never overwrites an existing file. If `.env` already exists,
compare its keys with `.env.example`. Docker also accepts these values from the
process environment. The image itself contains no `.env` or runtime secrets.

Choose the intended Docker context before starting the stack. On a Mac with
Docker Desktop, use `docker --context desktop-linux compose ...` if the active
context points to a remote server. Set `WEB_PORT=3100` before the Compose command
if port 3000 is already occupied.

- Website: `http://localhost:3000/`
- CMS: `http://localhost:3000/admin/`
- Published notes: `http://localhost:3000/notes/`
- CMS REST API: `/api/cms/` (the contact API remains at `/api/contact/`)

On first launch, visit `/admin/` and create the first administrator account.
There are no default admin credentials. Later accounts can only be created by
an authenticated administrator. All CMS accounts have editorial/admin access;
separate editor roles are not configured.

The stack binds to `127.0.0.1` by default. Complete the first-account setup
before exposing it publicly. For deployment, configure your HTTPS reverse proxy,
set `PAYLOAD_PUBLIC_SERVER_URL` to the site's public origin, and set
`WEB_BIND_ADDRESS` as appropriate for that proxy. PostgreSQL is not published on
the host in the main Compose file.

## Publishing notes

1. Open **Posts → Create New** in the CMS.
2. Enter a title, excerpt and rich text content. The URL slug is generated from
   the title on creation; it can also be supplied manually. Once created, title
   changes preserve the slug. Changing the slug changes the public URL.
3. Optionally upload a cover image or insert images into the content. The media
   library accepts JPEG, PNG, WebP, AVIF and GIF files up to 10 MiB and requires
   alternative text. Uploaded media files have public URLs.
4. Use **Save Draft** while writing, then **Publish**. The first publication sets
   the date automatically. The date is for display and ordering, not scheduling.
5. The note appears immediately in `/notes/`, at `/notes/<slug>/`, and in the
   sitemap. No image rebuild or container restart is needed. Saving a draft
   revision keeps the previous published version online. **Unpublish** removes
   the public article and its sitemap entry.

Posts retain up to 50 versions. Anonymous readers only see published content,
including through the REST API. The website always queries the published
version, even when the visitor is signed in to the CMS. The notes list is
paginated, with 12 entries per page. Existing conversation topics remain below it.

Password reset emails use the same `SMTP_*` settings as the contact form and
require `PAYLOAD_PUBLIC_SERVER_URL` for a usable reset link. Without SMTP,
email delivery fails explicitly; reset tokens are not logged to the console.
No email is needed for the initial account setup or normal editing.

## Persistence and schema changes

Compose keeps three named volumes:

- `postgres-data`: posts, users, sessions, versions and media metadata.
- `media-data`: uploaded image files and generated thumbnails.
- `contact-data`: existing contact-form rate limits and quarantined submissions.

`docker compose down` preserves these volumes. `docker compose down --volumes`
erases them. Back up both PostgreSQL and the media volume, as well as `.env`.
For example, export the database before deploying a schema change:

```bash
docker compose exec -T db pg_dump -U cwb -d cwb -Fc > cwb-backup.dump
```

The committed initial migration creates the database schema automatically when
Payload initializes in production. The health endpoint `/api/health/` checks the
CMS database, so the container becomes healthy only after initialization succeeds.
The standalone image builds without a database connection. Automatic schema push
is disabled in every environment; schema changes must have committed migrations.

After changing a collection or editor configuration:

```bash
pnpm generate:types
pnpm generate:importmap
pnpm payload migrate:create descriptive_change_name
pnpm payload migrate
pnpm lint
```

Commit generated types, the import map, and migration files including the JSON
schema snapshot. Check the generated SQL before deployment. Production uses
`prodMigrations` bundled into the standalone server and runs pending migrations
on initialization. This Compose setup is designed for one web replica; coordinate
migrations separately before introducing multiple replicas.

## Development outside Docker

You can run Next.js on the host while retaining PostgreSQL in the same project:

```bash
pnpm cms:setup
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
pnpm payload migrate
pnpm dev
```

The development override exposes PostgreSQL only at `127.0.0.1:54329`.
`cms:setup` writes a matching host `DATABASE_URL`. If you change `POSTGRES_PORT`,
update that URL as well. Do not run the production web container and host dev
server on the same HTTP port. Host development stores uploads in `storage/media`;
the production container uses its own media volume.

## Runtime configuration

See `.env.example` for all settings. Required Compose variables are
`PAYLOAD_SECRET` and `POSTGRES_PASSWORD`; use a URL-safe database password
(`cms:setup` generates hex). Keep both stable between restarts. Changing
`POSTGRES_PASSWORD` in `.env` does not rotate an existing database user's password.

The contact form still uses:

- `CONTACT_FORM_SECRET`: stable signing secret for contact challenges.
- `CONTACT_STORAGE_DIR`: writable state directory, set by Compose.
- `CONTACT_RECIPIENT` / `CONTACT_FROM`: mailbox and sender address.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`:
  SMTP delivery settings. `SMTP_SECURE=true` enables implicit TLS, usually on 465.

## Verification

```bash
pnpm lint
pnpm test:contact
pnpm build
docker compose config --quiet
```

Run the CMS regression checks against a disposable local stack. The test writes
and removes its own records; bootstrap mode is only for an empty test database:

```bash
WEB_PORT=3100 docker compose -p cwb-cms-test up --build -d --wait
CMS_TEST_ALLOW_WRITES=1 CMS_TEST_BOOTSTRAP=1 \
  CMS_TEST_RESTART_PROJECT=cwb-cms-test pnpm test:cms
docker compose -p cwb-cms-test down --volumes
```

When using Docker Desktop with another context active, use
`docker --context desktop-linux compose ...` and pass
`CMS_TEST_DOCKER_CONTEXT=desktop-linux` to the regression command. The script
accepts `CMS_TEST_URL` (default `http://127.0.0.1:3100`) and existing test credentials
through `CMS_TEST_EMAIL` / `CMS_TEST_PASSWORD`. It checks authentication, draft
privacy, publishing, uploads, rendering, sitemap updates, revisions, validation,
JSON-LD escaping, unpublishing, and optionally database/media persistence across
a restart. CI runs these checks against the production Compose image.

Linting uses Oxlint and `eslint-plugin-simple-import-sort`; `pnpm lint:fix`
applies automatic fixes. The generated Payload import map is excluded from
linting. Type checking remains part of `pnpm build`.

## Contributions

While I appreciate your interest, I am not currently accepting pull requests for this project.

## License

This project is licensed under the MIT License. See the LICENSE.md file for details.

## Contact

Feel free to contact me at [mail@wojciechbajer.com] for any questions or feedback.
