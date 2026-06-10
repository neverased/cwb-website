import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer homepage";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Home",
    title: "Multimedia, software systems, and clearer technical decisions.",
    summary:
      "A direct technical practice for multimedia systems, software engineering, architecture, and independent audits.",
    terminalPath: "cwb://home",
  });
}
