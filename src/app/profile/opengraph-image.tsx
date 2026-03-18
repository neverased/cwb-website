import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer profile page";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Profile",
    title: "A technical operator across media, product, and system design.",
    summary:
      "Structured profile page for Wojciech Bajer with expertise, selected collaborations, credibility, and direct contact routes.",
    terminalPath: "cwb://profile/about",
  });
}
