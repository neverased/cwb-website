import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer services page";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Services",
    title: "Media, software, architecture, audits, leadership, and AI.",
    summary:
      "Service map for multimedia work, software engineering, application architecture, independent audits, fractional technical leadership, and AI or LLM engineering.",
    terminalPath: "cwb://profile/services",
  });
}
