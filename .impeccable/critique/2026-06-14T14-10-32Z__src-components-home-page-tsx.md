---
target: /
total_score: 29
p0_count: 1
p1_count: 3
timestamp: 2026-06-14T14-10-32Z
slug: src-components-home-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Boot + contact form report status well; the command deck never signals its tabs drive the route card/terminal. |
| 2 | Match System / Real World | 2/4 | Faux-CLI (`$ route work=...`, `cwb://focus`, "signal in/out") mismatches the explicitly non-technical half of the audience. |
| 3 | User Control and Freedom | 3/4 | `skip intro` exists but boot is forced on first visit; skip is low-contrast and not first-focusable. |
| 4 | Consistency and Standards | 3/4 | Tokens tightly consistent, but numbered `01-04` scaffolding and the off-palette red RZETELNA accent break the stated brand. |
| 5 | Error Prevention | 4/4 | `required`/`minLength`/`maxLength`, honeypot, math challenge, email always visible. Strong. |
| 6 | Recognition Rather Than Recall | 3/4 | `deckStatus` echoes the active tab; rest is recall-light by luck, not design. |
| 7 | Flexibility and Efficiency | 3/4 | One-click mailto, skip, multiple routes; no motion replay/dismiss beyond OS setting. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Hero right rail crams four sub-modules; decorative sweeps/pulses add motion noise. |
| 9 | Error Recovery | 4/4 | Inline plain-language failure states with email fallback. Exemplary. |
| 10 | Help and Documentation | 2/4 | Zero onboarding for the interactive deck; faux-CLI unexplained. |
| **Total** | | **29/40** | **Good (upper band): solid foundation, the entrance and hero drag it.** |

## Anti-Patterns Verdict

Does this look AI-generated? **Borderline.**

**LLM assessment:** The body transcends generic AI work: a genuine chamfer-notch shape system applied consistently with flat depth (1px mint border + inset hairline, no drop shadows), asymmetric bento grids (capability cards span 6/6/5/7; a 3-row hero outcome card), real blue-chip logos, and concrete non-generic copy. But the surface lives inside the single most common second-order AI reflex ("make a technical person's site a hacker terminal"), and the *entrance* regresses fully into it: a full-viewport boot console with traffic-light dots, a `%` progress bar, scramble-on-every-heading, and faux-CLI strings. The body would Pass; the boot console + ubiquitous faux-terminal scaffolding pull it to Borderline. It is the first thing every new visitor sees.

**Deterministic scan:** `detect.mjs` on the homepage markup (`home_page.tsx`, `site_header.tsx`, `contact_panel.tsx`, `credibility_panel.tsx`, `scramble_text.tsx`, `use_scramble.tsx`, `page.tsx`) returned `[]`, exit 0: zero findings, no false positives. Clean, but the scan is markup-pattern based; it structurally cannot see the CSS-level and data-driven issues the review caught. Notably it did **not** flag the numbered `01-04` scaffolding (the numbers come from `coreSignals[].id` / `operatingModel[].step` data rendered into spans, not literal `01 ·` markup), nor the glowing red wordmark or decorative sweeps. Detector-clean is not slop-clean here.

**Visual overlays:** Not available. Screenshots and the detect.js overlay write into the Playwright MCP sandbox, not the repo filesystem, so no user-visible `[Human]` overlay could be confirmed. Fallback: scripted in-page measurement (contrast, decision-point counts, overflow, tap targets, type scale) via `browser_evaluate` on the live `localhost:3000` page at 1440px and 390px.

## Overall Impression

The contact path and the shape system are genuinely good; the entrance and the hero are the problem. A time-pressed recruiter or non-technical founder spends their first seconds on a boot animation that says nothing about who Wojciech is or what he shipped, then meets a dense dual-focus hero in terminal dialect. The single biggest opportunity: make the real hero the first thing seen (boot as a fast, optional reveal over already-rendered content) and give the page one scannable "who/what/proof" read above the fold.

## What's Working

1. **Operator-grade contact resilience** (`contact_panel.tsx`). Email renders first, the form has a honeypot + math challenge, and failure states keep the conversion path alive with an inline mailto. This is integrity, not theater, and exactly on-brand. Browser check corroborates: contact copy and labels clear 4.5:1 contrast.
2. **A real signature shape, consistently applied.** The `--corner-cut` clip-path chamfer + 1px mint border + inset hairline (flat depth, no drop shadows) appears on topbar, deck, cards, buttons, and inputs. Non-default identity executing the "Signal Control Room" spec, and the detector confirms no ghost-card / over-round / gradient-text tells.
3. **Contrast and layout discipline.** 0 low-contrast failures across 122 visible text samples on the dark teal panels; no horizontal overflow at 1440px or 390px. The muted phosphor body color clears AA, which is the most common AI-design readability failure and this passes it.

## Priority Issues

**[P0] Focusable control + live region nested inside `aria-hidden="true"`.**
- Why it matters: `.bootLayer` has `aria-hidden="true"` (`home_page.tsx:138`) yet contains the focusable `skip intro` button (146-152) and the `TerminalLoader`'s `<pre aria-live="polite">` (`use_scramble.tsx:188`). A keyboard/AT user can tab to a button the AT is told to ignore (WCAG 4.1.2), and the polite live region is suppressed so boot announces nothing.
- Fix: move the skip button out of the hidden subtree, make it the first focusable element, and don't mark a region hidden while it owns interactive/live content.
- Suggested command: `$impeccable harden`

**[P1] `ScrambleText` ignores `prefers-reduced-motion`.**
- Why it matters: `scramble_text.tsx` runs `useScramble` unconditionally; the boot and scroll reveals are reduced-motion gated but the H1/H2 scramble is not, undercutting the overhaul's accessibility claim. Secondarily, the H1 text is injected by JS into an empty span, so it renders empty without JS.
- Fix: short-circuit to static text under reduced motion; render text as real children with scramble as enhancement.
- Suggested command: `$impeccable harden`

**[P1] Boot gate spends the first impression on an animation.**
- Why it matters: first-time visitors wait through the sequence (up to a ~6.4s fallback cap) before content. The project-critical 20-second recruiter loses ~25% of their budget before seeing identity or the Dolby/Polestar/Volvo proof.
- Fix: cut the hard cap to ~2-2.5s, render the real hero behind the boot so it is what gets revealed, and make skip prominent and first-focusable. Lean harder on the existing once-per-session `sessionStorage` gate.
- Suggested command: `$impeccable distill`

**[P1] Mobile tap targets below the 44px guideline.**
- Why it matters: at 390px the primary nav chips are 32px tall, the four command-deck tabs are 38px tall, and two text links (`cwb://home` lockup, `rzetelnafirma.pl/...`) are 17-18px tall. All under 44x44, on the screen where the deck also reorders so the tabs (`order: 3`) fall *below* the route card and terminal they control, breaking cause to effect.
- Fix: raise nav/tab min-height to >=44px on touch; restore tabs-above-output order on mobile.
- Suggested command: `$impeccable adapt`

**[P2] Shipped brand "Don'ts": numbered scaffolding + off-palette glowing red.**
- Why it matters: numbered `01-04` is live in two sections (`coreSignals[].id`, `operatingModel[].step`), and the RZETELNA wordmark uses `#e14545` + `text-shadow: 0 0 1rem` glow, neither mint nor lime, reintroducing glow into a flat-depth system and out-ranking the real client logos. Both are on the explicit Don'ts list.
- Fix: drop the visible index numbers (or demote to non-numeric markers); re-skin the credibility accent to mint/lime, flat.
- Suggested commands: `$impeccable quieter`, `$impeccable colorize`

**[P2] Decorative sweeps/pulses survived the "remove decorative sweeps" overhaul.**
- Why it matters: `verificationSweep`/`verificationPulse` (credibility) and `contactSweep`/`contactPulse` (contact) still animate low-opacity decoration, inconsistent with the overhaul and adding ambient motion noise that competes with content.
- Fix: remove or convert to a single static hairline detail.
- Suggested command: `$impeccable quieter`

**[P3] Logo wall asserts association with no caption.**
- Why it matters: `selectedCollaborations[].tag` is defined but never rendered and alt text is only "X logo"; a skeptical recruiter sees names with no claim of role.
- Fix: add one line of role/scope per logo, or a single honest qualifier.
- Suggested command: `$impeccable clarify`

## Persona Red Flags

**Jordan (confused first-timer):** The full-screen boot with `$ route work=media software architecture audits` and a red dot reads like a loading error or a dev console, not "a consultant's site is loading." The `.focusTab` buttons give no affordance that they are interactive; `cwb://focus` and "what this fixes" assume terminal literacy.

**Riley (stress tester):** Tabs into the `skip intro` button that AT is told to ignore (the aria-hidden bug). Triggers reduced motion and still sees scrambling headings. Disables JS and the H1 renders empty.

**Casey (distracted mobile):** The boot panel eats the entire first mobile view. The deck reorders so the controlling tabs (`order: 3`) sit below their own output, and nav chips (32px) and deck tabs (38px) are under the 44px thumb target on the exact screen where precision is hardest.

**Recruiter / hiring manager (20-second fit skim):** Loses seconds to the boot. The H1 "Clear decisions. Cleaner delivery." states no role, seniority, or stack. The real fit signal (Dolby/Polestar/Volvo) sits below boot + hero + outcomes + credibility and carries no caption of what he did, while a regional RZETELNA badge gets a glowing red headline treatment above those logos. No scannable "who / what / years / stack" block exists above the fold.

## Minor Observations

- Dead CSS: `page.module.css` redefines `.topbar`, `.brandPrompt`, `.brandName`, `.nav` (~196-242), but `SiteHeader` uses `site_header.module.css`. Unused.
- Voice inconsistency: hero is singular ("I turn messy media..."), `credibilitySignal.description` switches to plural ("We participate... our credibility certificate") for a one-person practice.
- The boot relocated a cliche rather than removing it: the command-deck window dots were removed, but `controlRed/Amber/Green` traffic-lights still live in `TerminalLoader`, now full-screen.
- `coreSignals[].id` doubles as the displayed "01" and the React key; `key={line}` in `deckTerminalLines` is content-as-key (safe now, brittle later).
- `CONTACT` carries a phone number never shown on the homepage (email-only here).
- One decorative `credibility_panel` span overflows the desktop viewport edge by ~46px (clipped, cosmetic).

## Questions to Consider

1. If a recruiter gives you 20 seconds, why do the first ~5 go to a boot animation that says nothing about who Wojciech is or what he shipped?
2. The brand Don'ts ban `01/02/03` scaffolding, so why do the capability and process sections still render "01-04"?
3. A glowing red RZETELNA outranks Dolby, Polestar, and Volvo visually. Is a Polish registry badge your strongest trust signal for an international audience, and why is the only red on the page spent there?
4. The operator is "literally technical," but half the audience is not. Does `$ route work=...` read as competence, or as a gate?
5. You stripped decorative sweeps from the background but kept sweeps and pulses inside the credibility and contact cards. Deliberate hierarchy, or missed cleanup?
