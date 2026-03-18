import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Wojciech Bajer contact page";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Contact",
    title: "Direct route, no middle layer.",
    summary:
      "Contact page for consulting, builds, architecture reviews, multimedia systems, and independent audits.",
    terminalPath: "cwb://profile/contact",
  });
}
