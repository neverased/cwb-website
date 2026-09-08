### Purpose

Resolve a stable target, review the design and relevant technical evidence, and report prioritized actionable findings. The report is the deliverable. Keep code and external systems read-only unless changes are requested. Persist a local snapshot only when within the requested scope; lack of persistence does not invalidate the review.

### Review boundaries

- Record design judgment before reading detector findings when practical, to reduce anchoring.
- Inspect a viewable target with available browser tools and record the actual evidence. Use the current tool documentation; do not assume a particular Browser API or injection capability.
- Use the bundled detector for supported local markup targets when it contributes relevant evidence. Narrow large scans to the requested surface. Unsupported targets or unavailable tools do not make manual review a failed run; state the limitation.
- Keep production and authenticated external pages read-only. Do not inject scripts or change their state for an overlay. A local development overlay is optional when the tool permits it and it helps the requested review.
- Record and stop local servers started for this review unless the user asked to keep them. Do not claim an overlay or screenshot exists without successful evidence.
- Report real findings and relevant strengths; do not invent issues to meet a count. Follow-up questions are optional and never a completion gate for a finished critique.

### Setup

1. **Resolve the target** to a concrete file path or URL. Prefer a source path over a dev-server URL when both identify the same surface; ports drift, paths do not.
   - "the homepage" -> `site/pages/index.astro` or `index.html`
   - "the settings modal" -> the primary component file
   - "this page" -> the current URL or source file
2. **Compute the slug**:
   ```bash
   node .agents/skills/impeccable/scripts/critique-storage.mjs slug "<resolved-path-or-url>"
   ```
   Keep it. If the command exits non-zero, skip persistence and trend for this run, but continue the critique.
3. **Read `.impeccable/critique/ignore.md`** if it exists. Drop matching findings silently; it is the only prior-run input critique consumes.

### Assessment Orchestration

Use separate reviewers only when independence materially helps the task and current authorization and tools permit delegation. Otherwise finish and record Assessment A, then gather Assessment B evidence and synthesize inline. Do not ask for subagents merely because a spawn tool is exposed.

Describe the actual method and limitations in the report. When delegating, give each reviewer a bounded target, source context, permitted surfaces, and output contract. Use the available tool schema; do not assume `fork_context`, a particular agent type, or a model override exists. Separate browser tabs are useful for independently active reviewers; an inline review may reuse its task-owned tab.

### Assessment A: Design Review

Read relevant source files and visually inspect the live page when browser automation is available. Think like a design director.

Evaluate:
- **AI slop**: Would someone believe "AI made this" immediately? Check all DON'T guidance from the parent Impeccable skill.
- **Holistic design**: hierarchy, IA, emotional fit, discoverability, composition, typography, color, accessibility, states, copy, and edge cases.
- **Cognitive load**: consult the [Cognitive Load Assessment](critique-rubrics.md#cognitive-load-assessment) section below; report checklist failures and decision points with >4 visible options.
- **Emotional journey**: peak-end rule, emotional valleys, reassurance at high-stakes moments.
- **Nielsen heuristics**: consult the [Heuristics Scoring Guide](critique-rubrics.md#heuristics-scoring-guide) section below; score all 10 heuristics 0-4.

Return: AI slop verdict, heuristic scores, cognitive load, emotional journey, relevant strengths and prioritized actual issues, persona red flags, minor observations, and provocative questions.

### Assessment B: Detector + Browser Evidence

Run the bundled detector and browser visualization evidence. Gather the technical evidence applicable to this target after recording the design assessment; disclose unavailable or unsupported checks.

CLI scan:
```bash
node .agents/skills/impeccable/scripts/detect.mjs --json [target]
```

- Pass markup files/directories as `[target]`; do not pass CSS-only files.
- For URLs, skip CLI scan and use browser visualization.
- For very large trees (500+ scannable files), narrow scope or ask.
- Exit code 0 = clean; 2 = findings.
- If the detector entrypoint is missing or fails to load, report deterministic scan unavailable and continue with browser/manual review.

Browser inspection is useful for a viewable target when browser automation is available. Live visualization is optional and limited to authorized local development targets. Use a localhost dev/static URL for local files; avoid `file://` unless the available browser explicitly supports this workflow. Overlay flow:

1. Create a fresh tab and navigate. Prefer the harness's native/browser-canvas screenshot path before hand-rolling a Playwright/Puppeteer script; only fall back to a custom script when no native browser tool is exposed.
2. Preflight mutable injection by setting `document.title` and appending a `<script>` tag. Read-only evaluate APIs do not count.
3. If mutation is unavailable, skip live server, browser presentation, and injection; report fallback signal.
4. If mutation is available, start `node .agents/skills/impeccable/scripts/live-server.mjs --background`, present the browser if supported, label `[Human]`, scroll top, inject `http://localhost:PORT/detect.js`, wait 2-3 seconds, read `impeccable` console messages, then stop the live server.
5. For multi-view targets, inspect representative views within the requested scope; do not impose a fixed page count.

Browser tool note: read the available browser tool documentation and use only supported APIs. Prefer inspection and screenshots; skip optional mutation or overlays when unsupported or outside the authorized local target.

Return: CLI findings JSON/counts, browser console findings if applicable, false positives, and skipped/failed browser steps with concrete reasons.

After Assessment B returns usable CLI findings, reuse them. Do not rerun `detect.mjs` in the parent unless Assessment B failed, was truncated, or omitted count, rule names, or file locations.

Codex failure accounting: final Run Notes must include target slug, ignore list, assessment independence, CLI detector, browser visibility, overlay injection, live-server cleanup, temp-file cleanup, and any fallback signal used. Do not run repo status checks, late API spelunking, or unrelated verification after the report is assembled.

### Generate Combined Critique Report

Synthesize both assessments into a single report. Do NOT simply concatenate. Weave the findings together, noting where the LLM review and detector agree, where the detector caught issues the LLM missed, and where detector findings are false positives.

The chat response is the primary user-facing deliverable. Present the full structured critique below in chat; do not replace it with a summary and a link. The persisted snapshot is only an archive/backlog for later commands.

Codex final-answer note: `$impeccable critique` produces a report artifact, so the final chat response should intentionally exceed the usual concise close-out style. Do not title the final response "Critique Summary" unless the user explicitly asked for a summary.

Structure your feedback as a design director would:

#### Report header provenance

State whether the review used independent agents or a sequential inline assessment and describe material evidence limitations.
- Dual-agent: `Method: dual-agent (A: <agent-id> · B: <agent-id>)`
- Sequential: `Method: sequential inline review (<material limitations, if any>)`

#### Design Health Score
> *Consult the [Heuristics Scoring Guide](critique-rubrics.md#heuristics-scoring-guide) section below.*

Present the Nielsen's 10 heuristics scores as a table:

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | ? | [specific finding or "n/a" if solid] |
| 2 | Match System / Real World | ? | |
| 3 | User Control and Freedom | ? | |
| 4 | Consistency and Standards | ? | |
| 5 | Error Prevention | ? | |
| 6 | Recognition Rather Than Recall | ? | |
| 7 | Flexibility and Efficiency | ? | |
| 8 | Aesthetic and Minimalist Design | ? | |
| 9 | Error Recovery | ? | |
| 10 | Help and Documentation | ? | |
| **Total** | | **??/40** | **[Rating band]** |

Be honest with scores. A 4 means genuinely excellent. Most real interfaces score 20-32.

#### Anti-Patterns Verdict

**Start here.** Does this look AI-generated?

**LLM assessment**: Your own evaluation of AI slop tells. Cover overall aesthetic feel, layout sameness, generic composition, missed opportunities for personality.

**Deterministic scan**: Summarize what the automated detector found, with counts and file locations. Note any additional issues the detector caught that you missed, and flag any false positives.

**Visual overlays** (if injection succeeded): Tell the user that overlays are now visible in the **[Human]** tab in their browser, highlighting the detected issues. Summarize what the console output reported. If browser visualization was attempted but injection failed, say that no reliable user-visible overlay is available and report the fallback signal instead.

#### Overall Impression
A brief gut reaction: what works, what doesn't, and the single biggest opportunity.

#### What's Working
Highlight 2-3 things done well. Be specific about why they work.

#### Priority Issues
The 3-5 most impactful design problems, ordered by importance.

For each issue, tag with **P0-P3 severity** (see [Issue Severity below](#issue-severity-p0p3) for definitions):
- **[P?] What**: Name the problem clearly
- **Why it matters**: How this hurts users or undermines goals
- **Fix**: What to do about it (be concrete)
- **Suggested command**: Which command could address this (from: $impeccable adapt, $impeccable animate, $impeccable audit, $impeccable bolder, $impeccable clarify, $impeccable colorize, $impeccable critique, $impeccable delight, $impeccable distill, $impeccable document, $impeccable harden, $impeccable layout, $impeccable onboard, $impeccable optimize, $impeccable overdrive, $impeccable polish, $impeccable quieter, $impeccable shape, $impeccable typeset)

#### Persona Red Flags
> *Consult the [Personas reference](#persona-based-design-testing) below.*

Auto-select 2-3 personas most relevant to this interface type (use the selection table in the reference). If `AGENTS.md` contains a `## Design Context` section from `impeccable init`, also generate 1-2 project-specific personas from the audience/brand info.

For each selected persona, walk through the primary user action and list specific red flags found:

**Alex (Power User)**: No keyboard shortcuts detected. Form requires 8 clicks for primary action. Forced modal onboarding. High abandonment risk.

**Jordan (First-Timer)**: Icon-only nav in sidebar. Technical jargon in error messages ("404 Not Found"). No visible help. Will abandon at step 2.

Be specific. Name the exact elements and interactions that fail each persona. Don't write generic persona descriptions; write what broke for them.

#### Minor Observations
Quick notes on smaller issues worth addressing.

#### Questions to Consider
Provocative questions that might unlock better solutions:
- "What if the primary action were more prominent?"
- "Does this need to feel this complex?"
- "What would a confident version of this look like?"

#### Run Notes
Keep this compact. Include status for target slug, ignore list, assessment independence, CLI detector, browser visibility, overlay injection, live server cleanup, and temp-file cleanup. For failed or skipped steps, give the concrete observed reason and the fallback signal used. In the final chat response, also include snapshot write and trend read status after persistence has run.

Codex Run Notes are final-chat only. Do not include this section in the persisted snapshot body, because persistence, trend read, and temp cleanup happen after the snapshot write and would otherwise archive stale status such as "pending after persistence."

**Remember**:
- Be direct. Vague feedback wastes everyone's time.
- Be specific. "The submit button," not "some elements."
- Say what's wrong AND why it matters to users.
- Give concrete suggestions. Cut "consider exploring..." entirely.
- Prioritize ruthlessly. If everything is important, nothing is.
- Don't soften criticism. Developers need honest feedback to ship great design.

### Persist the Snapshot

Once the report above is finalized, write it to `.impeccable/critique/` so the user can refer back, and so `$impeccable polish` can pick up the priority issues without a copy-paste.

Skip this step when persistence is outside the requested scope or the Setup slug was null (vague or root-level target).

1. **Write the body to a temp file** so you can pipe it to the helper. Use the full critique report (heuristic table, anti-patterns verdict, priority issues, persona red flags, minor observations, and questions), but stop before the "Ask the User" / "Recommended Actions" sections that come later.

   Codex: exclude Run Notes from the temp body file; Run Notes are final-chat only because persistence, trend read, and temp cleanup happen after the snapshot write.

2. **Pass the structured metadata** through `IMPECCABLE_CRITIQUE_META` (JSON), then run the write command:
   ```bash
   IMPECCABLE_CRITIQUE_META='{"target":"<user phrasing>","total_score":<n>,"p0_count":<n>,"p1_count":<n>}' \
     node .agents/skills/impeccable/scripts/critique-storage.mjs write <slug> <body-file>
   ```
   The helper prints the absolute path it wrote.

3. **Delete the temp body file** after the write attempt completes, whether the write succeeded or failed. If deletion fails, mention `temp-file cleanup failed: <reason>` briefly in the final output, but do not block the critique.

4. **Read the trend** for context:
   ```bash
   node .agents/skills/impeccable/scripts/critique-storage.mjs trend <slug> 5
   ```
   This returns a JSON array of the last 5 frontmatter entries (including the one you just wrote).

5. **Append a single line to the user-visible output**, after the report and before the questions:

   > **Trend for `<slug>` (last 5 runs): 24 → 28 → 32 → 29 → 32**
   > Wrote `.impeccable/critique/<filename>`.

   If this is the first run for the slug, the trend is just one score; say so: "First run for this target, no trend yet."

This is fire-and-forget. Do not show the user the helper's JSON output; only the human-readable trend line and the written path. Failures here should not block the rest of the flow; print the error and move on.

### Follow-up and recommended actions

Finish the requested review with prioritized, evidence-backed findings and concise next steps. A finished critique does not require a follow-up questionnaire. Ask only about a material unresolved decision necessary for separately requested work, and honor scope and authorization already given.

Recommend relevant commands only when they would address actual findings. Do not invent issues to fill a scorecard or require a final polish pass irrespective of remaining work. An audit or critique alone does not authorize implementing the findings.

## Conditional assessment references

For a detailed rubric, read the relevant part of [critique rubrics](critique-rubrics.md). Use the cognitive-load, heuristic-scoring, and persona sections only when they help assess the requested target. Examples are not evidence of defects in the project.
