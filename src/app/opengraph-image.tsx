import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer homepage";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Landing",
    title: "Multimedia, software systems, and clearer technical decisions.",
    summary:
      "Terminal-grade personal brand site for Wojciech Bajer across multimedia, software engineering, architecture, and audits.",
    terminalPath: "cwb://landing",
  });
}
