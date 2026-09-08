---
name: imagegen-frontend-mobile
description: "Generate mobile app screen concepts or requested flows for iOS, Android, or a specified cross-platform design."
---

# Mobile app concept images

This skill produces image concepts. Follow the user's requested platform, screens, flow, count, and framing. Do not turn an image request into app implementation or generate additional screens to meet a quota. If no count is supplied, start with the requested screen or one representative concept.

Use supplied screens and brand assets as visual references. Respect iOS or Android conventions rather than mixing incompatible navigation, typography, status bars, and controls. For a cross-platform concept, choose a consistent platform treatment or clearly distinguish requested variants.

Prioritize readable text, safe areas, content hierarchy, clear primary actions, and consistent navigation. Phone framing is optional and should not shrink the UI; honor requests for flat screenshots or device mockups. A generated image illustrates intended behavior and cannot demonstrate a working app.

## Conditional references

- For platform layout and multi-screen continuity, read [platforms and flows](references/platforms-and-flows.md).
- For imagery, type, and art direction, read [visual system](references/visual-system.md).
- For image prompting and completion, read [generation and review](references/generation-and-review.md).

Use the actual image-generation tool. Zoom or inspect supplied images to understand details; generate or edit only when needed for the requested concept. Expand the set only for a requested flow or a concrete unresolved detail, not for default screen counts or repeated cosmetic passes.

## Working boundaries

The user's brief, existing brand, supplied assets, real content, and requested platform take precedence over aesthetic examples. Preserve exact authorized copy and distinguish visual observations from inferred behavior. Use available, licensed fonts when producing implementation-ready specifications; a raster concept alone does not establish font licensing or a production vector identity.

Do not fabricate execution, metrics, prices, dates, contact details, certifications, endorsements, customer logos, or testimonials. Clearly label fictional sample content when a mockup calls for it. Never change real values to make a layout look more natural.

Design for readable contrast, clear hierarchy, appropriate safe areas, and visible controls. A still image does not verify keyboard behavior, accessibility semantics, responsive implementation, or motion. Describe those as intended behavior when relevant; do not claim runtime validation from an image.

## Completion

Inspect the actual generated artifact for the requested scope, identity, composition, spelling, and legibility. Correct concrete defects with a targeted edit or regeneration. Deliver the real images or artifact paths and identify remaining limitations. An image-only task does not require application builds, browser interaction tests, extra screens, or source-code changes.
