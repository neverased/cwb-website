---
name: full-output-enforcement
description: "Use when the user explicitly requests a complete file, full implementation, or exhaustive artifact with no omitted deliverables."
---

# Complete requested output

Deliver every item the user requested at the requested level of completeness. A full-file request needs the full file; a requested patch or focused excerpt does not need unrelated surrounding code. Match the artifact's scope and risk rather than treating every task as production-critical.

Do not replace required implementation with a skeleton, omitted section, or a comment saying to implement it later. Ordinary language ellipses, spread syntax, and legitimate TODOs outside the requested scope are not automatically errors.

Track the requested deliverables and finish them before reporting completion. For a long artifact, write complete workspace files when available and provide links with a concise explanation. Continue necessary work across tool calls or context continuation instead of imposing an arbitrary "send continue" checkpoint.

If a real tool or context limit prevents completion, state exactly what is complete, what remains, and the limiting condition. Do not present a partial artifact as finished or fabricate a successful run.

Verify the artifact in a way appropriate to its type and changes. Report actual verification and unresolved limitations. Completeness does not require unsolicited features, unrelated files, or repeated test suites after the relevant checks pass.
