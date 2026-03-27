# Contact Form Anti-Spam Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the PHP-backed contact form with first-party anti-spam controls that quarantine suspicious submissions instead of delivering them to the inbox.

**Architecture:** Keep the existing `ContactPanel -> contact.php -> mail()` flow, but move anti-spam logic into a reusable PHP helper so it can be tested from the CLI before the handler and frontend are rewired. Add a lightweight bootstrap endpoint for signed challenge data, then update the React form to fetch that data and submit the extra anti-spam fields. Runtime state for rate limits and quarantine should live in `sys_get_temp_dir()` so the static export setup stays intact.

**Tech Stack:** Next.js static export, React 19 client component, PHP `mail()`, CLI PHP regression script, pnpm build

---

### Task 1: Extract testable PHP anti-spam primitives

**Files:**
- Create: `public/contact_antispam.php`
- Create: `scripts/contact-antispam-regression.php`
- Modify: `public/contact.php`

- [ ] **Step 1: Write the failing PHP regression script**

Create a CLI regression script that requires `public/contact_antispam.php` and covers the first pure behaviors:

```php
assertSame('quarantine', classify_submission([
    'honeypot_hits' => 1,
    'is_rate_limited' => false,
    'spam_score' => 0,
    'has_invalid_payload' => false,
]));

assertTrue(is_valid_bootstrap_signature($payload, $token, 'test-secret'));
assertFalse(is_valid_bootstrap_signature($payload, 'bad-token', 'test-secret'));
```

Focus the first tests on deterministic helpers only:

- signing and verifying bootstrap payloads
- minimum-age check
- challenge answer verification
- classification mapping for `accept`, `quarantine`, `reject`

- [ ] **Step 2: Run the regression script and verify it fails**

Run:

```bash
php scripts/contact-antispam-regression.php
```

Expected: FAIL because the helper file and functions do not exist yet.

- [ ] **Step 3: Implement the minimal helper layer**

In `public/contact_antispam.php`, add focused functions for:

- normalization helpers reused by contact flow
- bootstrap payload creation and HMAC signing
- bootstrap payload verification
- challenge generation and answer checking
- timing checks
- spam scoring helpers
- final classification helper

Keep the file procedural and small-function oriented so the CLI script can call it directly.

- [ ] **Step 4: Run the regression script again and verify it passes**

Run:

```bash
php scripts/contact-antispam-regression.php
```

Expected: PASS with a short summary such as `All contact anti-spam regression checks passed.`

- [ ] **Step 5: Commit**

```bash
git add public/contact_antispam.php scripts/contact-antispam-regression.php public/contact.php
git commit -m "feat: add contact anti-spam helper primitives"
```

### Task 2: Add bootstrap endpoint, rate limiting, and quarantine handling

**Files:**
- Create: `public/contact_bootstrap.php`
- Modify: `public/contact_antispam.php`
- Modify: `public/contact.php`

- [ ] **Step 1: Write failing regression checks for request classification**

Extend `scripts/contact-antispam-regression.php` with end-to-end helper tests for the request-policy layer:

```php
$result = evaluate_submission($server, $post, $options);
assertSame('quarantine', $result['classification']);
assertContains('submitted_too_fast', $result['reasons']);
```

Cover at least:

- valid accepted submission
- too-fast submission quarantined
- filled honeypot quarantined
- invalid token rejected
- content with spammy URLs/phrases quarantined

- [ ] **Step 2: Run the regression script and verify it fails for the new cases**

Run:

```bash
php scripts/contact-antispam-regression.php
```

Expected: FAIL because `evaluate_submission()` and related storage/rate-limit behavior are incomplete.

- [ ] **Step 3: Implement the bootstrap endpoint and server-side policy**

Build:

- `public/contact_bootstrap.php` returning JSON with nonce, issued timestamp, signed token, and simple arithmetic challenge
- storage helpers in `public/contact_antispam.php` that default to `sys_get_temp_dir() . '/cwb-contact'`
- file-based rate limiting keyed by IP and optional email hash
- quarantine writer using date-partitioned `jsonl`
- `public/contact.php` wired to:
  - validate normal fields
  - verify bootstrap payload and challenge
  - compute spam score
  - classify to `accept`, `quarantine`, or `reject`
  - send only accepted messages
  - redirect quarantined submissions to the same public `sent` status

- [ ] **Step 4: Run regression checks and PHP lint**

Run:

```bash
php scripts/contact-antispam-regression.php
php -l public/contact_antispam.php
php -l public/contact_bootstrap.php
php -l public/contact.php
```

Expected: all commands PASS with no syntax errors.

- [ ] **Step 5: Commit**

```bash
git add public/contact_antispam.php public/contact_bootstrap.php public/contact.php scripts/contact-antispam-regression.php
git commit -m "feat: harden contact php handler with quarantine flow"
```

### Task 3: Add bootstrap-aware client behavior to the contact form

**Files:**
- Modify: `src/components/contact_panel.tsx`
- Modify: `src/components/contact_panel.module.css`

- [ ] **Step 1: Write the smallest failing UI expectation through build-oriented validation**

Because there is no frontend test harness, define the first failing condition as a compile-time/UI contract:

- `ContactPanel` must render a loading-safe submit state before bootstrap loads
- it must render a challenge field after bootstrap loads
- it must stop secure submit when bootstrap fails

Implement this task in TDD spirit by changing the component shape only after the PHP endpoint contract is clear and by using the build as the immediate verification gate.

- [ ] **Step 2: Run the build before UI changes**

Run:

```bash
pnpm build
```

Expected: PASS on the pre-change UI baseline.

- [ ] **Step 3: Implement minimal client logic**

Update `src/components/contact_panel.tsx` to:

- fetch `/contact_bootstrap.php` on mount
- store loading, ready, and unavailable states
- render hidden anti-spam fields from bootstrap response
- render one simple challenge prompt and answer input
- disable submit until bootstrap is ready
- show fallback guidance to the email link if secure bootstrap fails

Update `src/components/contact_panel.module.css` only as needed for:

- challenge field styling
- disabled submit state
- secure-channel error banner

- [ ] **Step 4: Verify build and smoke-check contact UI**

Run:

```bash
pnpm build
```

Then visually verify `/contact` and the homepage contact section, confirming:

- the form loads without layout breakage
- the challenge field appears
- the submit button is not active before bootstrap readiness
- fallback copy is readable if the endpoint is unavailable

- [ ] **Step 5: Commit**

```bash
git add src/components/contact_panel.tsx src/components/contact_panel.module.css
git commit -m "feat: add secure bootstrap flow to contact form"
```

### Task 4: Final verification and deployment readiness checks

**Files:**
- Modify: `src/app/contact/page.tsx`
- Modify: `docs/superpowers/plans/2026-03-27-contact-form-anti-spam.md`

- [ ] **Step 1: Tighten route copy only if needed**

If the new secure form behavior needs one sentence of clarification on the contact route, update `src/app/contact/page.tsx` minimally. Do not redesign the page.

- [ ] **Step 2: Run the full verification set**

Run:

```bash
php scripts/contact-antispam-regression.php
php -l public/contact_antispam.php
php -l public/contact_bootstrap.php
php -l public/contact.php
pnpm build
```

Expected:

- PHP regression script passes
- all PHP files lint cleanly
- static export build passes

- [ ] **Step 3: Review generated behavior manually**

Manually confirm:

- suspicious submissions do not trigger `mail()`
- quarantine files appear under the temp storage root
- valid submissions still use the existing success redirect
- invalid/tampered payloads return `invalid` or `error`

- [ ] **Step 4: Commit**

```bash
git add public/contact_antispam.php public/contact_bootstrap.php public/contact.php src/components/contact_panel.tsx src/components/contact_panel.module.css src/app/contact/page.tsx docs/superpowers/plans/2026-03-27-contact-form-anti-spam.md scripts/contact-antispam-regression.php
git commit -m "feat: add first-party anti-spam protection to contact form"
```
