---
target: /
total_score: 28
p0_count: 0
p1_count: 3
timestamp: 2026-06-10T18-34-38Z
slug: src-components-home-page-tsx
---
**Anti-Patterns Verdict**
| Check | Verdict | Evidence |
|---|---:|---|
| LLM assessment | Pass with reservations | The redesign no longer reads as the rounded-card AI refresh. It has a real terminal/HUD identity, sharp edges, and a stronger operator signal. The remaining AI-generic tell is repetition: dark glow, oversized panels, and section rhythms that repeat more than they explain. |
| Deterministic scan | Mixed | CLI detector on `src/components/home_page.tsx` returned `[]`. Browser detector found 70 flagged elements: 63 `low-contrast`, 5 `clipped-overflow-container`, and 2 `dark-glow`. Several low-contrast hits are decorative gradient false positives, but the accent system is genuinely overused. |
| Visual overlays | Pass | Browser overlay injection succeeded through Impeccable live server `detect.js`; runtime scan produced overlay evidence. Clean screenshots were captured again after removing the detector state. |

**Design Health Score**
| Nielsen heuristic | Score /4 | Notes |
|---|---:|---|
| Visibility of system status | 3 | Boot/status language is strong, but first-visit boot still competes with the offer. |
| Match between system and real world | 2 | Clients still need to decode `signal`, `route`, `surface`, and problem taxonomy. |
| User control and freedom | 3 | Navigation and email/form paths are present; boot has no explicit skip or timeout fallback. |
| Consistency and standards | 3 | Site-wide terminal system is coherent, sometimes too uniform. |
| Error prevention | 3 | Contact form has anti-spam and direct email fallback. |
| Recognition rather than recall | 3 | Services are visible, but abstract labels require interpretation. |
| Flexibility and efficiency | 3 | Direct email, service route, and contact form serve different intent levels. |
| Aesthetic and minimalist design | 3 | Stronger and less generic than before; density and repeated panels still dilute impact. |
| Error recovery | 3 | Contact fallback is clear; boot failure fallback is not explicit. |
| Help and documentation | 2 | The page lacks a concrete engagement example or project brief guidance above the fold. |
| **Total** | **28/40** | **Good foundation, but client clarity and hierarchy need another pass.** |

**Overall Impression**
This is a real improvement over the previous refresh. The hero has an authored technical mood, the logo finally has presence, and the right-hand terminal no longer feels like an oversized generic card. The page now communicates technical credibility quickly.

The main problem is not polish. It is translation. Potential clients and hiring managers can feel that the operator is technical, but they still have to work too hard to understand the exact buying path: what situation they are in, what Wojciech delivers, what evidence supports it, and what to do next.

**What’s Working**
- The brand signal is now immediate: logo, terminal frame, command language, and dark mint palette align.
- The H1, `Clear decisions. Cleaner delivery.`, is concise and memorable.
- The RZETELNA Firma proof and client logo strip add credibility without becoming a fake metric block.
- The page keeps direct conversion paths: mailto CTA, service route, and protected form.
- The hard-edge visual treatment reduces the earlier rounded-card AI-slop problem.

**Priority Issues**
- `P1` Hero clarity still asks visitors to decode taxonomy before value. The supporting copy at [src/components/home_page.tsx](/Users/neverased/Codebase/cwb-website/src/components/home_page.tsx:126) compresses four different offers into one sentence, while the deck starts with “Choose the problem type” at [src/components/home_page.tsx](/Users/neverased/Codebase/cwb-website/src/components/home_page.tsx:156). Why it matters: a client should understand “this is for my situation” before interacting with categories. Fix: rewrite the hero body into audience + trigger + deliverable, then make the deck prove one selected route instead of requiring early choice. Suggested command: `[$impeccable](/Users/neverased/Codebase/cwb-website/.agents/skills/impeccable/SKILL.md) clarify /`.
- `P1` Conversion labels are still internal. `Email Wojciech`, `Open service map`, `Open process map`, and `Open contact route` appear at [src/components/home_page.tsx](/Users/neverased/Codebase/cwb-website/src/components/home_page.tsx:131), [src/components/home_page.tsx](/Users/neverased/Codebase/cwb-website/src/components/home_page.tsx:305), [src/components/home_page.tsx](/Users/neverased/Codebase/cwb-website/src/components/home_page.tsx:338), and [src/components/home_page.tsx](/Users/neverased/Codebase/cwb-website/src/components/home_page.tsx:384). Why it matters: route/map language fits the brand, but buyers respond to action and outcome. Fix: keep the primary nav labels if required, but change section CTAs toward user intent: send brief, review services, see process, start contact. Suggested command: `[$impeccable](/Users/neverased/Codebase/cwb-website/.agents/skills/impeccable/SKILL.md) clarify /`.
- `P1` The page repeats the same terminal-dark panel grammar too often. Large outcome/capability cards are enforced by [src/app/page.module.css](/Users/neverased/Codebase/cwb-website/src/app/page.module.css:854) and [src/app/page.module.css](/Users/neverased/Codebase/cwb-website/src/app/page.module.css:949). Why it matters: once every section uses the same dark grid rhythm, the site starts to feel generated even though the palette is distinctive. Fix: vary section architecture: one proof ledger, one route board, one process strip, one contact console. Reduce forced card heights where content is short. Suggested command: `[$impeccable](/Users/neverased/Codebase/cwb-website/.agents/skills/impeccable/SKILL.md) layout /`.
- `P2` Boot is now safer than a full-screen intro, but it still competes with first comprehension. The boot layer is always rendered until completion at [src/components/home_page.tsx](/Users/neverased/Codebase/cwb-website/src/components/home_page.tsx:84) and is fixed above page content at [src/app/page.module.css](/Users/neverased/Codebase/cwb-website/src/app/page.module.css:187). Browser timing confirmed it completes and persists session state, but there is no independent timeout or skip control if the scramble callback stalls. Fix: cap boot to a short non-blocking accent, move it away from the hero decision area, and add a timeout or reduced-motion fast path. Suggested command: `[$impeccable](/Users/neverased/Codebase/cwb-website/.agents/skills/impeccable/SKILL.md) harden /`.
- `P2` Mobile first fold spends too much height on chrome. At 390px wide, the header occupies about 166px, the H1 begins around 303px, and the proof/outcome content lands below the first viewport. The mobile header stacks instead of compressing at [src/components/site_header.module.css](/Users/neverased/Codebase/cwb-website/src/components/site_header.module.css:102). Fix: tighten mobile nav, consider a compact menu, and pull one proof cue into the hero fold. Suggested command: `[$impeccable](/Users/neverased/Codebase/cwb-website/.agents/skills/impeccable/SKILL.md) adapt /`.
- `P2` Accent color is overextended into glow, surfaces, and text. Runtime detector samples repeatedly found text/accent collisions around mint/yellow gradients and glow surfaces. Some are detector artifacts, but the visual pattern is real. Fix: reserve mint for command/status/action, use calmer surface ramps for panels, and verify actual contrast on boot text, terminal text, and active tabs. Suggested command: `[$impeccable](/Users/neverased/Codebase/cwb-website/.agents/skills/impeccable/SKILL.md) colorize /`.

**Persona Red Flags**
- Founder or product lead: may admire the technical mood but still ask, “What exactly do I get after contacting him?”
- Hiring manager: sees strong operator identity, but concrete role fit and project evidence are thinner than the visual shell.
- Nontechnical decision-maker: terms like `signal`, `route`, `surface`, and `operating model` create a decoding tax before trust is established.

**Minor Observations**
- The client logo strip is useful proof, but it sits after a large outcome block; consider moving one proof cue higher.
- The RZETELNA certificate panel is a good credibility anchor, but its CTA is visually small compared with the proof value it carries.
- The focus tabs work, but they may be more valuable after the visitor has already seen deliverables.
- The terminal deck is no longer “huge,” but on mobile it still dominates the first screen after the CTA.

**Questions to Consider**
- Should the boot terminal be a remembered brand flourish only, or should it become a small ambient “working terminal” module embedded later on the page?
- Can section CTA labels change from route/map language to buyer-action language, or are those labels part of the desired brand voice?
- Should the homepage optimize first for clients, hiring managers, or a 50/50 split? The current copy tries to satisfy both but is strongest for technical peers.
