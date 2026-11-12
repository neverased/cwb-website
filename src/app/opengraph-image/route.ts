import { createOgImage } from "@/lib/og";

export const dynamic = "force-static";
export function GET() {
  return createOgImage({
    eyebrow: "Home",
    title: "Multimedia, software systems, and clearer technical decisions.",
    summary:
      "A direct technical practice for multimedia systems, software engineering, architecture, independent audits, fractional leadership, and applied AI.",
    terminalPath: "cwb://home",
  });
}
