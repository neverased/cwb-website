# Ambient HUD Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visible-but-controlled ambient HUD layer across the site using CSS and inline SVG-style markup, without introducing Lottie in the first pass.

**Architecture:** Keep the current page structure and strengthen it with layered CSS motion, pseudo-elements, and a few explicit decorative markup nodes in the most important places. The homepage gets the strongest treatment in hero, collaborations, credibility, operating model, and contact; shared background and panel motion primitives also propagate to subpages. There is no existing frontend test harness, so verification for this plan uses `pnpm build` plus Playwright smoke checks on key routes.

**Tech Stack:** Next.js App Router, React 19, CSS Modules, static export, Playwright MCP for visual smoke checks

---

### Task 1: Establish shared ambient motion primitives

**Files:**
- Modify: `src/app/page.module.css`
- Modify: `src/app/subpage.module.css`
- Modify: `src/components/contact_panel.module.css`
- Modify: `src/components/credibility_panel.module.css`

- [ ] **Step 1: Capture current visual baseline**

Run:

```bash
pnpm build
```

Expected: build passes before the ambient pass begins.

- [ ] **Step 2: Add slow, reusable motion keyframes and overlay variables**

Add shared CSS primitives directly in the existing modules instead of creating a new abstraction layer:

```css
@keyframes hudSweep {
  0% { transform: translate3d(-18%, 0, 0); opacity: 0; }
  20% { opacity: 0.18; }
  80% { opacity: 0.18; }
  100% { transform: translate3d(118%, 0, 0); opacity: 0; }
}

@keyframes markerPulse {
  0%, 100% { opacity: 0.28; transform: scale(0.98); }
  50% { opacity: 0.62; transform: scale(1.02); }
}
```

Use them to strengthen:

- the page background shell in `src/app/page.module.css`
- the shared subpage shell in `src/app/subpage.module.css`
- panel-level overlays in contact and credibility CSS modules

- [ ] **Step 3: Keep reduced-motion behavior explicit**

Extend the existing reduced-motion blocks so the new overlays and sweeps are disabled when motion reduction is requested:

```css
@media (prefers-reduced-motion: reduce) {
  .page::before,
  .page::after,
  .contactCard::after,
  .panel::after {
    animation: none;
  }
}
```

- [ ] **Step 4: Run build after shared primitives land**

Run:

```bash
pnpm build
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/page.module.css src/app/subpage.module.css src/components/contact_panel.module.css src/components/credibility_panel.module.css
git commit -m "feat: add ambient HUD motion primitives"
```

### Task 2: Enrich the homepage hero and section scaffolding

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.module.css`

- [ ] **Step 1: Add minimal decorative markup where pseudo-elements are not enough**

Add small, explicit ambient nodes to the homepage only where layout needs anchors:

```tsx
<aside className={styles.commandDeck}>
  <div className={styles.heroHud} aria-hidden="true">
    <span className={styles.heroSweep} />
    <span className={styles.heroRing} />
    <span className={styles.heroRail} />
  </div>
  ...
</aside>
```

Do the same for:

- signal strip wrapper
- operating model wrapper
- collaborations section wrapper if needed

- [ ] **Step 2: Add hero-specific HUD geometry**

Use `src/app/page.module.css` to make the hero feel like an active system surface:

- moving scan band behind or across the right console
- corner brackets or rails around the command deck
- marker ring and thin diagnostic line
- optional softer sweep over the hero area itself

- [ ] **Step 3: Add section-level ambient accents**

Use CSS in `src/app/page.module.css` to differentiate the homepage sections without animating each card independently:

- signal strip: moving highlight and quiet corner markers
- collaborations: loaded-state frame and low-intensity sweep on logo surfaces
- operating model: routing rails or diagnostic line connectors between cards

- [ ] **Step 4: Verify homepage rendering**

Run:

```bash
pnpm build
```

Then visually verify `/` with Playwright and confirm:

- hero overlays are visible immediately
- motion stays behind content
- collaboration cards remain readable

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/page.module.css
git commit -m "feat: add ambient HUD overlays to homepage"
```

### Task 3: Add focused verification and transmission accents

**Files:**
- Modify: `src/components/credibility_panel.tsx`
- Modify: `src/components/credibility_panel.module.css`
- Modify: `src/components/contact_panel.module.css`
- Modify: `src/app/contact/page.tsx`

- [ ] **Step 1: Add credibility-panel markup for a precise verification gesture**

Extend the panel markup only if needed for a stronger verification beam:

```tsx
<div className={styles.verificationLayer} aria-hidden="true">
  <span className={styles.verificationBeam} />
  <span className={styles.verificationMarker} />
</div>
```

If the panel can be handled cleanly with pseudo-elements alone, skip extra markup and keep the DOM smaller.

- [ ] **Step 2: Implement the credibility verification pass**

In `src/components/credibility_panel.module.css`, add:

- a slow vertical scan or beam
- a restrained authenticated-state pulse
- color discipline that respects the existing red `RZETELNA` accent

- [ ] **Step 3: Add transmission framing to contact**

In `src/components/contact_panel.module.css`, add ambient behavior around the form and support card:

- input/output style edge rails
- subtle transmission line or beacon pulse
- form card feels instrumented, not noisy

Keep all interaction states readable and unaffected.

- [ ] **Step 4: Confirm contact route behavior**

Run:

```bash
pnpm build
```

Then visually verify `/contact` with Playwright and confirm:

- the ambient layer does not interfere with inputs
- status banner remains readable
- the page still feels quieter than hero

- [ ] **Step 5: Commit**

```bash
git add src/components/credibility_panel.tsx src/components/credibility_panel.module.css src/components/contact_panel.module.css src/app/contact/page.tsx
git commit -m "feat: add verification and transmission accents"
```

### Task 4: Propagate ambient shell behavior to subpages and finish verification

**Files:**
- Modify: `src/app/subpage.module.css`
- Modify: `src/app/services/page.tsx`
- Modify: `src/app/process/page.tsx`
- Modify: `src/app/notes/page.tsx`

- [ ] **Step 1: Strengthen shared subpage shell**

Use `src/app/subpage.module.css` to give subpages the same ambient family as the homepage, but at lower intensity:

- scan shell in page background
- quiet panel rails
- restrained card highlights
- no heavy hero-grade overlays

- [ ] **Step 2: Add only minimal route-specific markup if required**

If any section needs explicit decorative anchors, add tiny ambient wrappers to the route components:

```tsx
<section className={styles.lead}>
  <div className={styles.leadHud} aria-hidden="true" />
  ...
</section>
```

Do not add visual clutter to every route unless it solves a real layout problem.

- [ ] **Step 3: Run full verification**

Run:

```bash
pnpm build
```

Use Playwright to smoke check:

- `/`
- `/services`
- `/process`
- `/notes`
- `/contact`

Expected:

- all routes render
- ambient motion is visible immediately but remains secondary to content
- no panel loses contrast or readability

- [ ] **Step 4: Review final diff for over-animation**

Manually inspect the resulting CSS and JSX diff. Remove any decorative element that:

- duplicates another motion cue
- appears in every card
- competes with headings, scramble, or form controls

- [ ] **Step 5: Commit**

```bash
git add src/app/subpage.module.css src/app/services/page.tsx src/app/process/page.tsx src/app/notes/page.tsx
git commit -m "feat: extend ambient HUD treatment to subpages"
```

### Task 5: Final integration verification

**Files:**
- Verify only: working tree state after Tasks 1-4

- [ ] **Step 1: Run final production verification**

Run:

```bash
pnpm build
```

Expected: PASS

- [ ] **Step 2: Run final browser smoke checks**

Verify in Playwright that:

- boot still hands off cleanly to the destination page
- hero remains the strongest visual moment
- collaborations, credibility, and contact show distinct ambient framing
- subpages inherit the same system language at lower intensity

- [ ] **Step 3: Prepare branch completion**

After all verifications pass, use the finishing workflow rather than leaving the branch in an ambiguous state.

```bash
git status --short
git log --oneline -5
```
