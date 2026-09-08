import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer notes";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Notes",
    title: "Ideas, observations and useful questions.",
    summary:
      "Conversation starters on architecture, multimedia delivery, and independent technical reviews.",
    terminalPath: "cwb://profile/notes",
  });
}
