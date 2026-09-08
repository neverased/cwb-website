# Implementation and verification

Reuse the project's components, tokens, fonts, icons, and assets where they express the source. Check dependency and Tailwind versions before introducing syntax or imports. Keep Next.js interactive state inside appropriate Client Components and clean up observers, timers, or animation instances.

Implement broad structure and typography first, then media and component detail. Use semantic links and controls, meaningful alternative text, visible focus, and real destinations. Decorative images can have empty alt text; meaningful images need useful alternatives. Preserve copy, translations, route behavior, and data bindings.

Use supplied images at appropriate resolution and aspect ratio. Reserve dimensions to prevent layout shift. Generate only missing or explicitly requested visual assets; use actual generation output and record its path. Do not fabricate generation, asset URLs, test results, or exact fidelity claims. If an asset cannot be obtained, clearly identify the limitation.

Compare a real render with the source at a representative size when rendering tools are available. Check hierarchy, alignment, wrapping, cropping, content order, contrast, and primary interactions. Also inspect a narrow viewport and applicable loading, empty, error, and keyboard states. Correct the highest-impact differences in a batch.

Run the relevant existing checks for changed behavior. After passing checks and resolving observed defects, finish; do not generate new references or repeat full test suites solely to satisfy a recipe. State which views and interactions were actually checked and distinguish unresolved source ambiguity from an implementation defect.
