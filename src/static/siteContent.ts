export const services = [
  {
    id: "multimedia",
    label: "Multimedia",
    status: "signal routing",
    headline: "Turn complex media delivery into a controlled system.",
    intro:
      "For launches, showrooms, branded experiences, and content operations where timing and quality cannot drift.",
    stages: [
      {
        label: "signal in",
        value: "brief, assets, runtime constraints",
      },
      {
        label: "operation",
        value: "pipeline design, production logic, coordination",
      },
      {
        label: "signal out",
        value: "launch-ready surface with less chaos",
      },
    ],
    deliverables: [
      "workflow map",
      "production supervision",
      "quality control",
      "interactive surface alignment",
    ],
    fit: "Best when media work carries product pressure and real deadlines.",
    command: "$ inspect surface=media goal=launch-ready signal=clean",
  },
  {
    id: "software",
    label: "Software",
    status: "runtime execution",
    headline:
      "Build product interfaces that stay fast, legible, and maintainable.",
    intro:
      "Frontend systems, internal tools, and integration layers where fast delivery still needs technical discipline.",
    stages: [
      {
        label: "signal in",
        value: "product goals, stack state, delivery bottlenecks",
      },
      {
        label: "operation",
        value: "implementation, integration, workflow cleanup",
      },
      {
        label: "signal out",
        value: "working software with fewer hidden liabilities",
      },
    ],
    deliverables: [
      "frontend systems",
      "internal tooling",
      "integration paths",
      "developer workflow cleanup",
    ],
    fit: "Best when execution matters as much as the architectural call.",
    command: "$ deploy surface=product mode=engineering risk=visible",
  },
  {
    id: "architecture",
    label: "Architecture",
    status: "system mapping",
    headline:
      "Expose structural weak points before scale turns them into cost.",
    intro:
      "Architecture work is about boundaries, coupling, dependencies, and the logic that teams will build on later.",
    stages: [
      {
        label: "signal in",
        value: "current system shape, product pressure, team constraints",
      },
      {
        label: "operation",
        value: "mapping, tradeoff analysis, boundary design",
      },
      {
        label: "signal out",
        value: "clear technical direction and fewer blind spots",
      },
    ],
    deliverables: [
      "architecture map",
      "dependency review",
      "tradeoff framing",
      "handoff-ready direction",
    ],
    fit: "Best when teams feel momentum, but the system underneath is still blurry.",
    command: "$ map surface=architecture trace=dependencies expose=debt",
  },
  {
    id: "audits",
    label: "Audits",
    status: "diagnostic mode",
    headline:
      "Get an independent read on product, process, and technical reality.",
    intro:
      "Audits are for companies that need signal, not ceremony: what is working, what is fragile, and what needs correction first.",
    stages: [
      {
        label: "signal in",
        value: "stack, process, ownership, roadmap pressure",
      },
      {
        label: "operation",
        value: "diagnosis, interviews, risk reading, evidence gathering",
      },
      {
        label: "signal out",
        value: "prioritized findings and concrete next decisions",
      },
    ],
    deliverables: [
      "risk register",
      "delivery diagnosis",
      "priority map",
      "recommended next steps",
    ],
    fit: "Best when the team is busy, but nobody fully trusts the picture.",
    command: "$ audit surface=company mode=product-tech output=signal",
  },
  {
    id: "fractional",
    label: "Fractional lead",
    status: "ongoing direction",
    headline:
      "Keep senior technical direction in the room without a full-time hire.",
    intro:
      "A continuing engagement for companies that need decisions owned, delivery watched, and technical risk managed between builds.",
    stages: [
      {
        label: "signal in",
        value: "roadmap, team shape, standing technical questions",
      },
      {
        label: "operation",
        value: "direction, delivery oversight, decision support",
      },
      {
        label: "signal out",
        value: "steady technical calls with a named owner",
      },
    ],
    deliverables: [
      "technical strategy",
      "delivery oversight",
      "hiring support",
      "decision log",
    ],
    fit: "Best when the company has outgrown ad hoc advice, but a full-time hire is premature.",
    command: "$ retain surface=leadership cadence=ongoing owner=named",
  },
  {
    id: "ai",
    label: "AI / LLM",
    status: "applied ai",
    headline: "Move AI features from promising demo to dependable product.",
    intro:
      "LLM integrations, agent systems, and AI-dependent features engineered to behave predictably under real usage, cost, and quality constraints.",
    stages: [
      {
        label: "signal in",
        value: "use case, data reality, prototype state",
      },
      {
        label: "operation",
        value: "integration, evaluation, agent and pipeline engineering",
      },
      {
        label: "signal out",
        value: "ai behavior your product can rely on",
      },
    ],
    deliverables: [
      "llm integrations",
      "agent systems",
      "evaluation harness",
      "model and vendor read",
    ],
    fit: "Best when the demo already works, but nobody trusts it in production yet.",
    command: "$ ship surface=ai from=prototype to=production risk=measured",
  },
] as const;

export const processFlow = [
  {
    step: "01",
    title: "Inspect the signal",
    summary:
      "Start with reality, not assumptions: stack, process, team friction, goals, and delivery risk.",
    input: "brief, context, stack state",
    operation: "read constraints, pressure, ownership, and weak links",
    output: "clean picture of what is actually happening",
    markers: ["stack", "friction", "risk"],
  },
  {
    step: "02",
    title: "Map the system",
    summary:
      "Turn observations into a working model with boundaries, dependencies, priorities, and decision points.",
    input: "observations, constraints, dependencies",
    operation: "structure the logic, sequence, and tradeoffs",
    output: "clear operating model for the next moves",
    markers: ["boundaries", "dependencies", "priorities"],
  },
  {
    step: "03",
    title: "Build or correct",
    summary:
      "Execute the important corrections: implementation, direction, workflow cleanup, or sharper delivery.",
    input: "mapped system, chosen priorities",
    operation: "reduce waste, correct weak points, ship usable change",
    output: "cleaner system state and less delivery noise",
    markers: ["implementation", "cleanup", "correction"],
  },
  {
    step: "04",
    title: "Leave a durable setup",
    summary:
      "Make the work survive handoff through clear artifacts, documented logic, and fewer hidden liabilities.",
    input: "working outputs, team context",
    operation: "package decisions, artifacts, and next actions",
    output: "durable handoff instead of temporary relief",
    markers: ["artifacts", "handoff", "durability"],
  },
] as const;

export const processArtifacts = [
  {
    label: "Architecture map",
    detail:
      "Boundaries, dependencies, and the shape teams should keep building on.",
  },
  {
    label: "Risk register",
    detail:
      "Visible weak points, hidden liabilities, and where complexity gets expensive.",
  },
  {
    label: "Execution route",
    detail: "Priority sequence, decision logic, and what should happen next.",
  },
  {
    label: "Review notes",
    detail:
      "Plain-language findings teams can reuse after the engagement ends.",
  },
] as const;

export const noteQueue = [
  {
    service: "architecture",
    status: "Topic",
    title: "Architecture reviews before scale gets expensive",
    summary:
      "How I assess product structure, coupling, delivery risk, and where teams usually hide technical debt.",
  },
  {
    service: "multimedia",
    status: "Topic",
    title: "What multimedia work teaches about software delivery",
    summary:
      "Signal flow, timing, and production discipline translate surprisingly well to digital product execution.",
  },
  {
    service: "audits",
    status: "Topic",
    title: "Audit patterns that reveal product confusion early",
    summary:
      "The recurring technical and organizational indicators I look for when a company feels busy but not aligned.",
  },
] as const;

export const credibilitySignal = {
  kicker: "Verified credibility",
  title: "RZETELNA Firma member",
  titleAccent: "RZETELNA",
  titleSuffix: "Firma member",
  description:
    "I participate in the program. Review the company profile and my credibility certificate.",
  actionLabel: "View certificate",
  displayUrl: "rzetelnafirma.pl/D72SOALK4C2PIGNR",
  href: "https://www.rzetelnafirma.pl/D72SOALK4C2PIGNR",
} as const;

export const selectedCollaborations = [
  {
    name: "Dolby",
    tag: "selected work",
    src: "/partners/logo_Dolby.svg",
    width: 975,
    height: 247,
    surface: "dark",
  },
  {
    name: "Polestar",
    tag: "selected work",
    src: "/partners/Polestar_Logo.svg",
    width: 1000,
    height: 221,
    surface: "light",
  },
  {
    name: "Volvo",
    tag: "selected work",
    src: "/partners/volvo-seeklogo.svg",
    width: 949,
    height: 74,
    surface: "light",
  },
  {
    name: "DHL",
    tag: "selected work",
    src: "/partners/logo_DHL.svg",
    width: 964,
    height: 358,
    surface: "yellow",
  },
  {
    name: "Leroy Merlin",
    tag: "selected work",
    src: "/partners/logo_leroy_merlin.svg",
    width: 2500,
    height: 2500,
    surface: "light",
  },
  {
    name: "Budimex",
    tag: "selected work",
    src: "/partners/logo_budimex.png",
    width: 400,
    height: 400,
    surface: "dark",
  },
  {
    name: "TDJ",
    tag: "selected work",
    src: "/partners/logo_TDJ.svg",
    width: 57,
    height: 52,
    surface: "dark",
  },
] as const;
