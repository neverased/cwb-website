---
target: /
total_score: 32
p0_count: 0
p1_count: 1
timestamp: 2026-06-14T15-47-12Z
slug: src-components-home-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4/4 | Boot dialog is AT-accessible; skip is focusable; contact form reports status well. Deck tabs still lack explicit "controls panel below" affordance. |
| 2 | Match System / Real World | 2/4 | Faux-CLI (`$ route work=...`, `cwb://focus`) still mismatches the non-technical half of the audience. Accepted brand trade-off. |
| 3 | User Control and Freedom | 3/4 | Skip intro works and is first-focusable; boot remains forced on first visit (user chose to keep full entrance). |
| 4 | Consistency and Standards | 4/4 | Voice is singular throughout; numbered scaffolding removed; RZETELNA uses flat lime accent; logo tags clarify scope. |
| 5 | Error Prevention | 4/4 | Contact form validation, honeypot, math challenge, email fallback. Strong. |
| 6 | Recognition Rather Than Recall | 3/4 | Deck status echoes active tab; faux-CLI still assumes recall for non-operators. |
| 7 | Flexibility and Efficiency | 3/4 | Mailto, skip, sessionStorage gate; no motion replay beyond OS setting. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Decorative sweeps removed; hero still dense with dual-focus terminal rail. |
| 9 | Error Recovery | 4/4 | Inline plain-language failure states with email fallback. |
| 10 | Help and Documentation | 2/4 | Zero onboarding for the interactive deck; faux-CLI unexplained. |
| **Total** | | **32/40** | **Good (upper band): P0 cleared; body and contact path are strong.** |

## Anti-Patterns Verdict

Does this look AI-generated? **Borderline (improved).**

**LLM assessment:** The body still transcends generic AI work: chamfer-notch shape system, flat depth, asymmetric grids, real logos with honest "selected work" captions, and concrete copy. The full-viewport boot + ubiquitous faux-terminal scaffolding remain the primary second-order reflex, but accessibility regressions from the prior run are resolved and decorative noise is reduced.

**Deterministic scan:** `detect.mjs` on homepage markup returned `[]`, exit 0. Clean.

**Browser evidence:** Playwright measurement at 390×844 after boot skip: 0 tap targets under 44px, no horizontal overflow, H1 renders real text, 7× "selected work" captions visible, credibility copy uses singular "I participate."

## Overall Impression

The accessibility and clarity pass landed. P0 boot layering is fixed, mobile targets and deck order are corrected, voice and logo scope are honest, and the brand Don'ts (numbered scaffolding, glowing red, decorative sweeps) are cleared. The remaining tension is intentional: the full boot entrance and terminal dialect trade recruiter seconds for brand statement.

## What's Working

1. **Operator-grade contact resilience** unchanged and exemplary.
2. **Accessibility hardening:** boot dialog semantics, inert background, reduced-motion scramble fallback, focusable skip.
3. **Honest proof:** logo wall now labels each mark "selected work"; credibility voice matches solo practice.

## Priority Issues

**[P1] Boot gate spends the first impression on an animation (accepted trade-off).**
- Why it matters: first-time visitors wait through the sequence before content. User explicitly chose to keep the full boot as brand statement.
- Fix: only revisit if conversion data warrants shortening; current state is intentional.
- Suggested command: n/a (accepted)

**[P2] Faux-CLI density for non-technical audience.**
- Why it matters: `$ route work=...` and deck tabs assume terminal literacy.
- Fix: add one plain-language deck intro line, or demote CLI strings to decorative tier.
- Suggested command: `$impeccable clarify`

**[P2] Hero dual-focus rail still dense.**
- Why it matters: four sub-modules in the hero right rail compete with the primary headline for attention.
- Fix: collapse to two modules or move deck below a cleaner hero read.
- Suggested command: `$impeccable distill`

## Persona Red Flags

**Jordan (first-timer):** Boot still reads like a dev console on first visit, though skip is now reachable and announced correctly.

**Recruiter (20-second skim):** Boot still consumes first seconds; H1 still states no role/stack, though logos now carry "selected work" scope labels.

## Minor Observations

- `CONTACT` static snippet still carries a phone number never shown on the homepage.
- Command deck tabs do not explicitly signal they drive the route card and terminal output.

## Questions to Consider

1. With P0 cleared, does the boot still cost more recruiter attention than it earns in brand recall?
2. Would one plain-language sentence above the deck tabs reduce the faux-CLI gate without killing the terminal voice?

## Trend

Prior snapshot: 29/40 (2026-06-14T14-10-32Z), P0=1, P1=3. Current: 32/40, P0=0, P1=1 (accepted boot trade-off). +3 points.
