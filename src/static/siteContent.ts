export const coreSignals = [
  {
    id: "01",
    title: "Multimedia systems",
    description:
      "Audio, video, and interactive experiences designed with the same rigor as product infrastructure.",
    detail:
      "Direction, production workflows, signal quality, delivery pipelines.",
  },
  {
    id: "02",
    title: "Software engineering",
    description:
      "Product delivery with clean interfaces, maintainable code, and the technical discipline to scale.",
    detail:
      "Frontend systems, integration work, internal tools, fast execution.",
  },
  {
    id: "03",
    title: "Application architecture",
    description:
      "System design that exposes weak points early and gives teams a clearer path to build on.",
    detail:
      "Architecture reviews, tradeoff mapping, platform structure, resilience.",
  },
  {
    id: "04",
    title: "Company and product audits",
    description:
      "Independent assessment of delivery, technology, and product decisions before complexity gets expensive.",
    detail:
      "Technical audits, process diagnostics, product signal, operational clarity.",
  },
] as const;

export const focusModules = [
  {
    id: "multimedia",
    label: "Multimedia",
    status: "signal routing",
    summary:
      "Audio, video, and interactive delivery designed like systems work, not like disconnected production tasks.",
    command: "$ inspect --surface media --goal launch-ready --signal clean",
    stack: [
      "audio and video pipelines",
      "capture to delivery workflows",
      "interactive presentation surfaces",
      "quality control under real deadlines",
    ],
  },
  {
    id: "software",
    label: "Software",
    status: "runtime execution",
    summary:
      "Shipping interfaces and product systems with maintainable code, fast iteration, and fewer hidden liabilities.",
    command: "$ deploy --surface product --mode engineering --risk visible",
    stack: [
      "frontend systems and interfaces",
      "integration and internal tooling",
      "developer workflow cleanup",
      "delivery without unnecessary ceremony",
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    status: "system mapping",
    summary:
      "Clarifying structure, coupling, and tradeoffs before scale turns small design mistakes into permanent cost.",
    command: "$ map --surface architecture --trace dependencies --expose debt",
    stack: [
      "platform shape and boundaries",
      "dependency mapping and risk zones",
      "handoff-ready technical direction",
      "decision support for product teams",
    ],
  },
  {
    id: "audits",
    label: "Audits",
    status: "diagnostic mode",
    summary:
      "Independent review of product, process, and technology when a company needs a cleaner read on reality.",
    command: "$ audit --surface company --mode product-tech --output signal",
    stack: [
      "technical and product audits",
      "delivery friction diagnosis",
      "process and ownership review",
      "concrete next-step recommendations",
    ],
  },
] as const;

export const operatingModel = [
  {
    step: "01",
    title: "Inspect the signal",
    text: "I start with what is actually happening: stack, process, team friction, product goals, and delivery risk.",
  },
  {
    step: "02",
    title: "Map the system",
    text: "Then I turn it into a concrete operating model: architecture, priorities, dependencies, and decision points.",
  },
  {
    step: "03",
    title: "Build or correct",
    text: "Execution can mean implementation, technical direction, sharper workflows, or reducing waste in the pipeline.",
  },
  {
    step: "04",
    title: "Leave a durable setup",
    text: "The output should stay useful after handoff: documented logic, cleaner systems, and fewer hidden liabilities.",
  },
] as const;

export const operatingSignals = [
  {
    label: "delivery mode",
    value: "advisory + hands-on",
    detail: "Strategy is useful only if execution can follow it.",
  },
  {
    label: "working surface",
    value: "media + product + systems",
    detail: "Creative and technical work share the same operating logic here.",
  },
  {
    label: "publishing mode",
    value: "notes shipped in code",
    detail: "Static output keeps the site simple, direct, and easy to host.",
  },
  {
    label: "engagement filter",
    value: "selected collaborations",
    detail:
      "Best fit when clarity, quality, and architectural rigor actually matter.",
  },
] as const;

export const executionConsole = [
  "capture current signal",
  "surface hidden constraints",
  "reduce technical noise",
  "ship a cleaner system state",
] as const;

export const serviceRouting = {
  incoming: [
    "delivery friction",
    "unclear technical direction",
    "media-heavy complexity",
    "independent review needed",
  ],
  surfaces: ["multimedia", "software", "architecture", "audits"],
  outgoing: [
    "cleaner execution path",
    "visible tradeoffs",
    "working system map",
    "durable next actions",
  ],
} as const;

export const serviceBoards = [
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
    command: "$ inspect --surface media --goal launch-ready --signal clean",
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
    command: "$ deploy --surface product --mode engineering --risk visible",
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
    command: "$ map --surface architecture --trace dependencies --expose debt",
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
    command: "$ audit --surface company --mode product-tech --output signal",
  },
] as const;

export const serviceSignals = [
  {
    label: "Typical entry points",
    items: [
      "product feels noisy",
      "delivery surface is fragile",
      "media stack is too ad hoc",
      "team needs an outside technical read",
    ],
  },
  {
    label: "What usually leaves",
    items: [
      "sharper system map",
      "clearer execution route",
      "visible risks and tradeoffs",
      "deliverables teams can actually use",
    ],
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

export const terminalFacts = [
  { label: "operator", value: "Wojciech Bajer" },
  { label: "location", value: "Poland // worldwide" },
  { label: "focus", value: "media, software, architecture" },
  { label: "mode", value: "consulting / audits / delivery" },
] as const;

export const signalStack = [
  "audio + video pipelines",
  "frontend and product systems",
  "architecture diagnostics",
  "technical and product audits",
] as const;

export const noteQueue = [
  {
    status: "Queued",
    title: "Architecture reviews before scale gets expensive",
    summary:
      "How I assess product structure, coupling, delivery risk, and where teams usually hide technical debt.",
  },
  {
    status: "Queued",
    title: "What multimedia work teaches about software delivery",
    summary:
      "Signal flow, timing, and production discipline translate surprisingly well to digital product execution.",
  },
  {
    status: "Queued",
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
    "We participate in the program. Review the company profile and our credibility certificate.",
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
