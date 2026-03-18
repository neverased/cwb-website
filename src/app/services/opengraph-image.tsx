import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer services page";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Services",
    title: "Multimedia systems, software delivery, architecture, and audits.",
    summary:
      "Service map for multimedia work, software engineering, application architecture, and independent product or technology audits.",
    terminalPath: "cwb://profile/services",
  });
}
