---
name: impeccable
description: "Design, refine, or review a frontend surface using scoped Impeccable commands for visual craft, usability, and accessibility."
version: 3.9.1
---

# Impeccable frontend craft

Use the command that matches the requested design, implementation, or review. Preserve the brief, project facts, established identity outside scope, and platform conventions. A review-only request does not authorize code changes, publication, or unrelated setup.

## Setup and scope

Inspect the target and representative code, tokens, components, and assets before editing. Read existing PRODUCT.md or DESIGN.md when relevant; their absence does not block a well-specified task. Use `init` only when requested or material missing product context needs to be captured, not as an obligatory gate for a small edit.

Resolve scripts relative to this loaded skill directory; retain the harness-specific command paths below as fallbacks. If useful context is not already available, run the bundled `scripts/context.mjs` once with the project as cwd and a supported target argument. Treat its output as context, not authority to add approval stops, run updates, or broaden the task. Do not repeat it without a relevant context change.

Load the reference for the explicitly requested or clearly implied command. For a new surface, read [the build workflow](reference/craft.md); for substantial visual choices, read [visual craft guidance](reference/visual-guidance.md). Narrow edits do not require every register, catalog, or reference. When native platform guidance exists, load the matching iOS/Android guidance only for that platform.

Ask only for material missing decisions that cannot be inferred or for authorization actually absent. Honor decisions and permissions already given. Use independent agents only when useful and permitted by current instructions; otherwise proceed inline rather than adding a delegation approval gate. Discover the actual available tools and signatures before calling them.

## Design and completion

Let the surface's purpose guide the work: Persuade, Operate, Read, or Experience. Respect the chosen aesthetic and real content. Do not fabricate data, endorsements, dates, metrics, tool execution, or verification. Use and inspect supplied visual references; generate images only when the requested artifact or missing asset needs them, without fixed quotas.

Keep semantics, keyboard access, visible focus, responsive behavior, reduced-motion alternatives, and working controls. Normal text needs 4.5:1 contrast; large text (18pt/24 CSS px, or 14pt/about 18.67 CSS px bold) needs 3:1. Preserve stricter project requirements. Motion, theme changes, font replacements, and decorative effects are optional design choices.

Complete the requested artifact, inspect the affected surface and states, run relevant existing checks, and fix observed material defects. Batch related inspection and edits; further checks need changed work, a failure, or an unresolved concern. Stop cosmetic iteration once the brief is satisfied. Report actual verification and limitations without claiming a complete render or generated result that was not inspected.

## Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | Build | Shape, then build a feature end-to-end | [reference/craft.md](reference/craft.md) |
| `shape [feature]` | Build | Plan UX/UI before writing code | [reference/shape.md](reference/shape.md) |
| `init` | Build | Set up project context: PRODUCT.md, DESIGN.md, live config, next steps | [reference/init.md](reference/init.md) |
| `document` | Build | Generate DESIGN.md from existing project code | [reference/document.md](reference/document.md) |
| `extract [target]` | Build | Pull reusable tokens and components into design system | [reference/extract.md](reference/extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [reference/critique.md](reference/critique.md) |
| `audit [target]` | Evaluate | Technical quality checks (a11y, perf, responsive) | [reference/audit.md](reference/audit.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive or overstimulating designs | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [reference/distill.md](reference/distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n, edge cases | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations and motion | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and fonts | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, and visual hierarchy | [reference/layout.md](reference/layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages | [reference/clarify.md](reference/clarify.md) |
| `adapt [target]` | Fix | Adapt for different devices and screen sizes | [reference/adapt.md](reference/adapt.md) |
| `optimize [target]` | Fix | Diagnose and fix UI performance | [reference/optimize.md](reference/optimize.md) |
| `live` | Iterate | Visual variant mode: pick elements in the browser, generate alternatives | [reference/live.md](reference/live.md) |

Plus three management commands: `pin <command>`, `unpin <command>`, and `hooks <on|off|status|...>`, detailed below.

## Routing

- With no command or task, present a brief context-aware menu; do not auto-run a command.
- For an explicit or clearly implied command, load its reference and continue. If two approaches are equivalent, choose the one that fits the requested outcome; ask only when their product implications materially differ.
- Missing PRODUCT.md does not force init before a narrow edit, review, or already specified build.
- `teach` aliases `init`. A standalone `shape` produces a planning brief; an authorized implementation continues through the build workflow without redundant confirmation.

## Pin / Unpin

**Pin** creates a standalone shortcut so `$<command>` invokes `$impeccable <command>` directly. **Unpin** removes it. The script writes to every harness directory present in the project.

```bash
node .agents/skills/impeccable/scripts/pin.mjs <pin|unpin> <command>
```

Valid `<command>` is any command from the table above. Report the script's result concisely. Confirm the new shortcut on success, relay stderr verbatim on error.

## Hooks

`$impeccable hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>` manages the design detector hook for this project. The hook auto-runs the detector after direct UI file edits and surfaces findings as system reminders. Full flow is in [reference/hooks.md](reference/hooks.md); load it when the user invokes `$impeccable hooks` with any argument.
