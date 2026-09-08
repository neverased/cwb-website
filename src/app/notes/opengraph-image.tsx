import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer consulting topics";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Topics",
    title: "A good question is a useful start.",
    summary:
      "Conversation starters on architecture, multimedia delivery, and independent technical reviews.",
    terminalPath: "cwb://profile/notes",
  });
}
