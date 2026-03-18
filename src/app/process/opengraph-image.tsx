import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer process page";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Process",
    title: "Inspect, map, correct, and leave a durable setup.",
    summary:
      "Operating model page describing how audits, architecture, and delivery work are structured from signal capture to handoff.",
    terminalPath: "cwb://profile/process",
  });
}
