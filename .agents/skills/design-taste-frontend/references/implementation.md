# Frontend implementation

## Fit the project

Inspect package.json, lockfile, styling entrypoints, tokens, relevant components, and the owning repository instructions. Verify installed versions before new imports. Use the existing package manager. Do not install libraries merely to satisfy a visual preset.

In Next.js, retain the project's Server/Client Component boundaries; browser state, effects, and event handling belong in Client Components. Keep interactive leaves isolated where useful, but do not rewrite the architecture for a visual edit. Match Tailwind v3/v4 syntax and configuration; v4 integrations use the appropriate PostCSS or Vite package rather than the old PostCSS plugin name.

Use existing design-system components and meaningful semantic elements. Avoid arbitrary z-index values; understand stacking contexts. Prefer fluid widths and appropriate viewport units. Do not mask layout defects by setting overflow hidden on the entire page.

## Assets and facts

Use local or verified source assets. Generate imagery only when the request and design call for it. Inspect actual output before using it, reserve image dimensions, and avoid broken or invented URLs. Do not use a random photo URL as evidence of a specific person or product.

Keep factual copy, names, metrics, dates, prices, testimonials, and customer logos tied to supplied or verified sources. Preserve real round numbers and repeated dates. Labeled sample data is appropriate for a requested mockup; invented precision is not evidence. If a testimonial is unsupported, omit the endorsement or use an explicitly labeled placeholder rather than create a realistic person and quote.

## States and accessibility

Implement the states the feature requires: useful loading feedback, empty-state guidance, inline validation, errors, and success feedback. Preserve labels and focus management. Do not replace working behavior with decorative simulation.

Check keyboard order and activation, visible focus, readable text, contrast, and touch access. Normal text needs 4.5:1 contrast; the 3:1 large-text threshold applies at 18pt/24 CSS px or 14pt/about 18.67 CSS px bold. Provide non-color status cues. Match the project's accessibility and target-size requirements.

Use meaningful image descriptions and empty alt text for purely decorative imagery. Keep essential content visible with motion disabled. Test long translated strings and narrow widths where affected. Do not impose both light and dark modes when only one is requested or supported.

## Verification

Inspect a real rendered affected surface where tools allow it. Run the project's relevant checks for behavior changed. Use performance profiling or Lighthouse when performance is in scope or evidence indicates a problem, not for every styling edit. Record actual outcomes; do not claim checks, screenshots, or generation that did not happen.
