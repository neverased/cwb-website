import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer notes page";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Notes",
    title: "Essays, breakdowns, and field observations.",
    summary:
      "Static-first writing hub for architecture reviews, multimedia lessons, and audit patterns from real delivery work.",
    terminalPath: "cwb://profile/notes",
  });
}
