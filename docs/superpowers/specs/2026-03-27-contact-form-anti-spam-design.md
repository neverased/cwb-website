# Contact Form Anti-Spam Design

Date: 2026-03-27
Status: Approved for planning

## Context

The current contact flow is intentionally lightweight:

- the site is exported statically via Next.js
- the form submits directly to `public/contact.php`
- delivery uses PHP `mail()` on shared hosting
- there is no external form backend or third-party anti-bot service

The current protection is limited to one honeypot field plus basic field validation. That is not enough to stop modern spam or scam submissions, and the result is too much unwanted mail reaching the inbox.

The user wants to stay with a first-party solution for now:

- no Cloudflare Turnstile, hCaptcha, or similar provider
- small amount of friction for real users is acceptable
- lightweight JavaScript may be added
- simple server-side state may be stored on hosting
- suspicious submissions should go to quarantine instead of the main inbox

## Goals

- Reduce spam and scam submissions reaching the mailbox.
- Keep the contact flow lightweight and compatible with the current hosting model.
- Add only a small amount of friction for legitimate users.
- Preserve the existing high-level submission flow and page structure.
- Capture enough diagnostic data to tune rules over time.

## Non-Goals

- Do not migrate the form to an external SaaS form provider.
- Do not introduce CAPTCHA services managed by a third party.
- Do not redesign the public contact page or rewrite the whole flow into a custom app backend.
- Do not optimize for no-JavaScript support in the first iteration.
- Do not silently delete suspicious submissions without retaining review data.

## Recommended Approach

Use a mixed anti-spam layer built from:

- PHP-issued bootstrap data for each form session
- lightweight JavaScript to fetch bootstrap data and render anti-spam fields
- multiple server-side checks in `contact.php`
- simple file-based rate limiting and quarantine storage on hosting

This gives the form stronger protection without introducing a separate backend platform or operational dependency.

## Architecture

### Current Flow

`ContactPanel` renders a static form and posts directly to `public/contact.php`, which validates fields and sends email through `mail()`.

### Proposed Flow

1. `ContactPanel` loads.
2. Client JavaScript requests `public/contact_bootstrap.php`.
3. The bootstrap endpoint returns:
   - `nonce`
   - `issued_at`
   - signed integrity token
   - challenge prompt
   - challenge metadata needed for verification
4. The form renders challenge fields and hidden anti-spam fields.
5. User submits to `public/contact.php`.
6. `contact.php` validates payload integrity, challenge response, submission timing, honeypots, rate limits, and spam score.
7. The submission is classified as one of:
   - `accept`
   - `quarantine`
   - `reject`
8. Accepted submissions are mailed normally.
9. Quarantined submissions are written to local storage with reasons and are not mailed to the inbox.
10. Rejected submissions are handled as invalid/error cases.

## Components

### `public/contact_bootstrap.php`

New PHP endpoint that creates short-lived anti-spam bootstrap data.

Responsibilities:

- generate a per-form nonce
- record issue timestamp
- create a signed token using a server-side secret
- generate a simple human challenge
- optionally persist minimal challenge state if needed for verification
- return JSON to the browser

The endpoint must be lightweight and safe for shared hosting.

### `src/components/contact_panel.tsx`

The React component remains the main UI entry point, but gains lightweight client logic.

Responsibilities:

- fetch bootstrap data after mount
- block or disable submit until bootstrap loads
- render challenge prompt and answer field
- include hidden fields such as `nonce`, `issued_at`, and signed token
- include additional honeypot fields with realistic names
- optionally include a client-side render timestamp or readiness marker
- present a clear fallback message if bootstrap loading fails

Because the site is statically exported, the component must treat PHP as the dynamic source of anti-spam state.

### `public/contact.php`

This remains the central submission handler and becomes the policy enforcement point.

Responsibilities:

- validate normal user fields
- validate bootstrap token and expiry
- verify challenge answer
- check minimum submission age
- inspect honeypots
- apply rate limiting
- compute spam score
- classify submission
- send accepted mail
- store quarantined entries
- redirect with public-facing status

## Classification Model

### `accept`

The submission appears legitimate and is delivered by email.

### `quarantine`

The submission is suspicious but not structurally broken. It is stored locally with detailed reasons and does not reach the inbox. The public response still behaves like success to avoid helping attackers tune their payloads.

### `reject`

The submission is malformed or clearly invalid. Examples:

- missing required fields
- invalid email format
- missing or expired signed token
- tampered bootstrap payload
- unsupported request method

Rejected submissions should not be mailed. Some may still be logged in a lightweight error log if helpful for debugging.

## Anti-Spam Signals

The system should combine several weak and strong signals instead of relying on one rule.

### Human Challenge

Use a simple first-party challenge with low user friction. Preferred form:

- one short arithmetic question, or
- one very simple explicit instruction

Examples:

- `What is 3 + 4?`
- `Type the number 6`

The answer should be tied to the issued bootstrap token so it cannot be trivially forged by posting static field values alone.

### Submission Timing

Track when the bootstrap was issued and how quickly the form is submitted.

Rules:

- extremely fast submissions should be suspicious
- normal human delay should pass cleanly
- expired bootstrap data should fail verification

Recommended starting thresholds:

- hard suspicious if submitted in under 4 seconds
- token expiry around 20 to 30 minutes

### Honeypots

Keep the current hidden trap but add at least one more realistic hidden field. Better names are more likely to attract unsophisticated bots.

Examples:

- `website`
- `company`
- `full_name_confirm`

Filled honeypots should usually classify to quarantine rather than reject.

### Rate Limiting

Use file-based counters keyed by:

- IP address
- optional secondary key derived from normalized email hash

Recommended starting rules:

- short-window burst limit
- longer cooldown window
- stricter handling for repeated quarantined attempts from the same source

The implementation should tolerate shared hosting and avoid requiring a database.

### Content Scoring

Assign suspicious weight for patterns commonly seen in contact-form spam.

Signals may include:

- multiple URLs in the message
- known outreach, SEO, crypto, casino, or link-building phrases
- repeated keywords
- excessive punctuation or symbol density
- very short generic message bodies
- repeated submissions with identical or near-identical content
- mismatch between user identity fields and message style

This should be score-based rather than binary so rules can be tuned gradually.

## Storage Design

The system needs local writable storage for rate limiting and quarantine.

Preferred structure:

- storage path outside public web root if hosting allows it
- otherwise a protected hidden directory with server access restrictions

Suggested layout:

- `contact-data/rate-limit/`
- `contact-data/quarantine/`
- `contact-data/runtime/`

Quarantine format:

- append-only `jsonl`
- grouped by date for simple review and cleanup

Each quarantine record should include:

- received timestamp
- normalized sender fields
- IP address
- user agent
- classification
- triggered reasons
- spam score
- original message content

## Secret Management

Bootstrap signing requires a secret not stored in git.

Preferred order:

1. environment variable on hosting
2. local PHP config file outside version control
3. last-resort ignored config file deployed manually

The secret should be used for HMAC signing of bootstrap payloads and any challenge integrity data.

## Public Behavior

The public-facing UX should intentionally avoid revealing too much about the anti-spam rules.

Rules:

- accepted submissions show success
- quarantined submissions also show success
- only structurally invalid cases show invalid or error

This reduces attacker feedback while keeping the form simple for legitimate users.

## Error Handling

- If bootstrap fetch fails, the UI should not submit a half-protected form.
- The form should display a short message that the secure contact channel is temporarily unavailable and direct users to the email link.
- If storage writes fail during quarantine, the handler should fail closed rather than sending suspicious content to the inbox.
- If mail sending fails for an accepted message, preserve the current `error` behavior.

## Security Considerations

- Sanitize header-related fields to avoid mail header injection.
- Never trust client timestamps or challenge metadata without server verification.
- Do not expose the challenge answer directly in the DOM in a trivially reusable form.
- Keep quarantine files non-public.
- Use constant-time comparisons where practical for signed token verification.
- Normalize and bound input sizes before scoring or persistence.

## Testing Strategy

Verification should cover both happy path and abuse path.

### Manual Scenarios

- legitimate user loads form, solves challenge, submits successfully
- form submit without bootstrap data fails safely
- submit with bad token is rejected
- submit too quickly is quarantined
- submit with filled honeypot is quarantined
- repeated burst submissions from one IP trigger rate limiting
- spammy content with links and known phrases is quarantined
- accepted mail still arrives correctly

### Operational Validation

- inspect quarantine files after test submissions
- confirm reasons and scores are understandable
- confirm rate-limit files rotate or expire cleanly
- confirm no writable anti-spam files are exposed publicly

## Rollout Notes

Start with conservative thresholds and review quarantine output after deployment. The first version should prioritize reducing inbox spam without aggressively blocking plausible real users. Score thresholds and phrase lists can then be tuned based on real quarantined traffic.

## Planning Outcome

The approved direction is:

- keep the existing `ContactPanel -> contact.php -> mail()` architecture
- add a PHP bootstrap endpoint for signed anti-spam session data
- add a simple first-party challenge with lightweight JavaScript
- classify suspicious traffic into quarantine instead of inbox delivery
- back the system with file-based rate limiting and logs on hosting
