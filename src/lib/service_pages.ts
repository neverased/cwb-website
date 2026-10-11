import type { ServiceId } from "@/lib/services";

const serviceSlugs = {
  multimedia: "multimedia-consulting",
  software: "software-engineering",
  architecture: "software-architecture",
  audits: "technical-audits",
  fractional: "fractional-cto",
  ai: "ai-llm-engineering",
} as const satisfies Record<ServiceId, string>;

export const servicePath = (id: ServiceId) => `/services/${serviceSlugs[id]}/`;

type ServicePage = {
  id: ServiceId;
  slug: string;
  title: string;
  description: string;
  heading: string;
  introduction: string;
  fit: string;
  scope: readonly string[];
  preparation: string;
  questions: readonly { question: string; answer: string }[];
  relatedServiceIds: readonly ServiceId[];
};

export const servicePages: readonly ServicePage[] = [
  {
    id: "multimedia",
    slug: serviceSlugs.multimedia,
    title: "Multimedia Systems Consulting | Wojciech Bajer",
    description:
      "Multimedia consulting for launches, showrooms and branded experiences. Plan media workflows, coordinate production and review delivery quality with Wojciech Bajer.",
    heading: "Multimedia systems consulting",
    introduction:
      "I help teams turn a multimedia brief into a workable delivery plan. The focus is the complete system: assets, production workflows, interactive surfaces and the people responsible for getting them ready. That matters when a launch or physical experience depends on several parts working together.",
    fit: "This work suits agencies, studios and companies preparing launches, showrooms, branded experiences or ongoing content operations. It is useful when ownership is unclear, production handoffs cause repeated rework, or the experience needs to be checked as a whole before delivery. We start with the constraints of the actual project.",
    scope: [
      "I map how material moves from the brief through production to its intended destination. That includes asset requirements, dependencies, review points and the relationship between media content and the software or interactive surface that presents it.",
      "Depending on the brief, the work can include pipeline design, production supervision, coordination and quality control. The aim is to make the next action and its owner clear, while keeping timing and presentation quality connected to the requirements of the experience.",
    ],
    preparation:
      "Share the brief, the intended experience, existing assets, the delivery date and any runtime constraints. Explain which teams or suppliers are involved and where work currently gets stuck. Incomplete material is still useful: identifying the missing decisions can be the first part of the engagement.",
    questions: [
      {
        question: "Can you join an existing production?",
        answer:
          "Yes. We can begin by reviewing the current workflow, assets and delivery risks, then agree where specialist support is most useful. The scope should reflect the stage of the project and the responsibilities already held by your team.",
      },
      {
        question: "What happens when media and software overlap?",
        answer:
          "We examine the handoff between content and the product that uses it, including how changes are reviewed and delivered. Where implementation or architectural decisions are needed, the work can connect with my software engineering and architecture services.",
      },
    ],
    relatedServiceIds: ["software", "architecture"],
  },
  {
    id: "software",
    slug: serviceSlugs.software,
    title: "Software Engineering Consulting | Wojciech Bajer",
    description:
      "Hands-on software engineering for frontend systems, internal tools and integrations. Turn product goals into maintainable delivery with Wojciech Bajer.",
    heading: "Software engineering consulting",
    introduction:
      "I build and improve product interfaces, internal tools and integration layers. The work connects a practical product goal with the code, dependencies and delivery workflow needed to support it. You work directly with the specialist making the technical decisions and implementing the agreed changes.",
    fit: "This is a useful starting point when a team needs hands-on delivery, an existing interface has become difficult to change, or manual work needs a dependable internal tool. It also suits agencies that need specialist implementation support for a defined part of a larger project.",
    scope: [
      "We first clarify who needs the software, which task it must support and how it fits the current system. I review the relevant code and constraints before recommending an implementation route. This helps separate the immediate delivery need from wider architectural questions.",
      "The scope can cover frontend implementation, integration work, internal tooling and developer workflow improvements. Alongside the feature itself, we consider maintainability, understandable behavior and a handoff your team can use. The specific checks and supporting documentation depend on the change and its risks.",
    ],
    preparation:
      "Bring the product goal, the current stack, a description of the users and the main delivery obstacle. Existing designs, repository context and examples of problematic behavior help define the first step. If the requirement is still unclear, we can begin with a focused review before committing to a build.",
    questions: [
      {
        question: "Do you work with an existing codebase?",
        answer:
          "Yes. Existing software and its constraints are part of the starting point. I look at how the relevant parts work today, what the team needs to preserve and where a bounded change can deliver a useful improvement.",
      },
      {
        question: "Should we start with development or a review?",
        answer:
          "A clear, understood requirement can lead directly to scoped implementation. If the obstacle involves uncertain dependencies, repeated failures or conflicting technical direction, an audit or architecture review can clarify what should be built or corrected first.",
      },
    ],
    relatedServiceIds: ["architecture", "audits"],
  },
  {
    id: "architecture",
    slug: serviceSlugs.architecture,
    title: "Software Architecture Reviews | Wojciech Bajer",
    description:
      "Independent software architecture reviews covering system boundaries, dependencies and technical tradeoffs. Get clear priorities and practical direction.",
    heading: "Software architecture reviews",
    introduction:
      "I help teams understand the structure of their software before making decisions that are difficult to reverse. An architecture review connects system boundaries and dependencies with product goals, team constraints and delivery risk. The result is a clearer basis for deciding what to keep, change or investigate.",
    fit: "Consider a review when a product is becoming harder to extend, dependencies make changes unpredictable, or the team is weighing a significant technical decision. It is also useful before a new build when the proposed structure needs an independent challenge and the alternatives are not yet clear.",
    scope: [
      "I examine the parts relevant to the decision: how responsibilities are divided, where components depend on each other and which assumptions shape the design. The review combines the current system with the way the team actually develops and operates it.",
      "We compare possible changes through their consequences for complexity, ownership and future delivery. Recommendations are tied to the constraints we can establish, with uncertainties made explicit. The handoff can include an architecture map, a dependency review and a sequence of decisions or corrections.",
    ],
    preparation:
      "Share the decision you need to make, a description of the system and the problems the team encounters. Diagrams, repository context and examples of difficult changes are helpful. Existing documentation does not need to be complete: discrepancies between the diagram and the working system are useful evidence.",
    questions: [
      {
        question: "Does an architecture review mean a rewrite?",
        answer:
          "No. The purpose is to understand the system and compare the available choices. Keeping the current structure, correcting a boundary or sequencing smaller changes can all be reasonable outcomes. A larger change needs a reason grounded in the product and delivery constraints.",
      },
      {
        question: "How is this different from a technical audit?",
        answer:
          "Architecture work concentrates on structure, dependencies and design decisions. A technical audit can look more broadly at code, process, ownership and delivery. If the problem is not yet well defined, the initial discussion helps choose the more useful starting point.",
      },
    ],
    relatedServiceIds: ["audits", "software"],
  },
  {
    id: "audits",
    slug: serviceSlugs.audits,
    title: "Technical Audits & Code Reviews | Wojciech Bajer",
    description:
      "Independent technical audits and code reviews for software products and delivery teams. Understand risks, prioritize findings and decide what to fix first.",
    heading: "Technical audits and code reviews",
    introduction:
      "I provide an independent review of a product, codebase, delivery process or technology decision. The aim is to establish what is happening, where the material risks are and which actions deserve attention first. Findings should help the team make decisions, with evidence and consequences explained in plain language.",
    fit: "An audit is useful when delivery feels fragile, technical explanations conflict or a company needs a clearer view before investing more effort. Founders, product leaders and agencies can use it to examine a defined concern without assuming in advance that the answer is a new tool, a rewrite or a larger team.",
    scope: [
      "We agree the question the audit should answer and the evidence needed to examine it. Depending on that scope, I review code and architecture, delivery practices, ownership, existing documentation and the constraints described by the people doing the work.",
      "The output separates observations from uncertainty and turns the findings into priorities. A risk register, delivery diagnosis and recommended next steps give the team a practical route forward. The review can focus on one product area or connect technical issues with wider process and coordination problems.",
    ],
    preparation:
      "Start with the concern, the decision it affects and any examples that make it concrete. Useful material includes repository context, incident descriptions, delivery bottlenecks and existing technical documentation. We can then define a scope that matches the question and identify any information the review still needs.",
    questions: [
      {
        question: "Can the review focus on a specific codebase or feature?",
        answer:
          "Yes. A focused code review can examine a particular implementation and its surrounding dependencies. The scope should name the question being answered, so the findings remain useful and the review does not imply coverage of parts that were not examined.",
      },
      {
        question: "Can you help implement the recommendations?",
        answer:
          "Hands-on software work and ongoing technical direction are also available. We can agree follow-up work after reviewing the findings. The audit itself should leave you with understandable priorities and next steps that your team can use to make that decision.",
      },
    ],
    relatedServiceIds: ["architecture", "fractional"],
  },
  {
    id: "fractional",
    slug: serviceSlugs.fractional,
    title: "Fractional CTO & Technical Leadership | Wojciech Bajer",
    description:
      "Fractional technical leadership for teams needing senior direction without a full-time hire. Technical strategy, delivery oversight and decision support.",
    heading: "Fractional CTO and technical leadership",
    introduction:
      "I provide ongoing technical direction for companies that need senior judgment and clear ownership without a full-time leadership hire. The engagement connects product priorities, delivery realities and technical decisions. It is a continuing working relationship shaped around the decisions your company needs help making.",
    fit: "This fits founders and product teams that have outgrown occasional advice but are not ready for a full-time technical leader. It can also help when a team needs continuity across projects, someone to challenge technical proposals or a clearer connection between the roadmap and the work being delivered.",
    scope: [
      "We establish the current priorities, team responsibilities and recurring decisions that need senior attention. From there, the work can include technical strategy, delivery oversight, architectural direction, hiring support and discussion of risks or tradeoffs with the people responsible for the business.",
      "Decisions need to remain understandable after a meeting. A decision log and explicit next steps help the team preserve context and follow through. The cadence, responsibilities and involvement in implementation are agreed around the company’s needs and the roles already held by its team.",
    ],
    preparation:
      "Describe the company’s current stage, who owns technical decisions and where the team needs support. Share the roadmap, standing technical questions and any delivery concerns. This gives us a basis for deciding which responsibilities belong in the engagement and how ongoing work should connect with your existing team.",
    questions: [
      {
        question: "How does this differ from a one-off consultation?",
        answer:
          "A consultation can address an individual question. Fractional leadership keeps context across decisions and follows delivery over time. It suits situations where the company needs continuing involvement in priorities and technical direction, rather than an isolated recommendation.",
      },
      {
        question: "Does this include hands-on engineering?",
        answer:
          "It can connect with implementation work, but the responsibilities should be explicit. Some engagements need direction and review; others also need a defined build or correction. We agree how those activities fit together so leadership duties and delivery work have clear ownership.",
      },
    ],
    relatedServiceIds: ["audits", "architecture"],
  },
  {
    id: "ai",
    slug: serviceSlugs.ai,
    title: "AI Engineering & LLM Integration | Wojciech Bajer",
    description:
      "AI engineering and LLM integration for product teams. Review prototypes, build agent systems and evaluation workflows, and understand quality and cost tradeoffs.",
    heading: "AI engineering and LLM integration",
    introduction:
      "I help product teams build LLM integrations, agent systems and AI-dependent features with a clear view of their behavior. The work connects the use case and available data with implementation, evaluation and operating constraints. A promising demonstration is a starting point for investigating what the product can reliably support.",
    fit: "This service suits teams moving from an idea or prototype into a product, or improving an integration whose quality or cost is difficult to understand. It is useful when the demo works but the team needs evidence about real inputs, failure cases and the consequences of model or workflow changes.",
    scope: [
      "We begin with the task the feature should perform, the data it can use and the expectations of its users. I review the current approach and help define the behavior that needs to be evaluated before choosing an integration or agent design.",
      "The scope can include LLM integration, agent and pipeline engineering, an evaluation harness and model or vendor assessment. Quality, usage cost and runtime constraints are considered together. The goal is to give the team a working implementation and a repeatable way to examine its strengths and limitations.",
    ],
    preparation:
      "Bring the use case, representative inputs, expected outputs and any existing prototype. Explain where the current behavior succeeds or fails, which data is available and what cost or response-time constraints matter. Examples from the intended workflow are more useful than a demonstration built only around ideal inputs.",
    questions: [
      {
        question: "Can you review an existing AI prototype?",
        answer:
          "Yes. We can examine the integration and use representative examples to identify what needs further evaluation or engineering. This helps distinguish a model limitation from a problem in the surrounding data, prompts, workflow or application behavior.",
      },
      {
        question: "Do we need a particular model or vendor?",
        answer:
          "The choice should follow the task, data and operating constraints. A model or vendor review can compare the relevant options against useful examples and tradeoffs. The evaluation should make the reasoning visible and give the team a basis for revisiting the choice later.",
      },
    ],
    relatedServiceIds: ["software", "architecture"],
  },
];

export const findServicePage = (slug: string) =>
  servicePages.find((page) => page.slug === slug);
