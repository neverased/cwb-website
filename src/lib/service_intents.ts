import { findService, type ServiceId } from "@/lib/services";

type ServiceIntent = {
  id: "review" | "build" | "direction";
  label: string;
  summary: string;
  defaultServiceId: ServiceId;
  serviceIds: readonly ServiceId[];
  signalPath: string;
};

export const serviceIntents: readonly ServiceIntent[] = [
  {
    id: "review",
    label: "Review a system",
    summary: "Understand the structure. Find the risks.",
    defaultServiceId: "audits",
    serviceIds: ["audits", "architecture"],
    signalPath: "M0 56H28L54 82V168H90",
  },
  {
    id: "build",
    label: "Build a product",
    summary: "Connect the idea to a working product.",
    defaultServiceId: "software",
    serviceIds: ["software", "multimedia", "ai"],
    signalPath: "M0 168H90",
  },
  {
    id: "direction",
    label: "Get technical direction",
    summary: "Keep decisions and delivery aligned.",
    defaultServiceId: "fractional",
    serviceIds: ["fractional"],
    signalPath: "M0 280H28L54 254V168H90",
  },
];

export const resolveServiceIntent = (id: string | null | undefined) => {
  const service = findService(id) ?? findService("audits")!;
  const intent = serviceIntents.find(({ serviceIds }) =>
    serviceIds.includes(service.id),
  )!;
  return { service, intent };
};

export const serviceExplorerHref = (id: ServiceId, interactive: boolean) =>
  interactive ? `/?service=${id}#service-explorer` : `/services/#${id}`;

export const serviceSelectionUrl = (currentHref: string, id: ServiceId) => {
  const url = new URL(currentHref);
  url.searchParams.set("service", id);
  url.hash = "service-explorer";
  return url;
};
