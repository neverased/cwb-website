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
