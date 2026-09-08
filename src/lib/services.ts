import { services } from "@/static/siteContent";

export type Service = (typeof services)[number];
export type ServiceId = Service["id"];

export const findService = (id: string | null | undefined) =>
  services.find((service) => service.id === id);

export const contactHref = (id: ServiceId) => `/contact/?service=${id}`;
