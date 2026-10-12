import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { getBrandImage } from "@/lib/brand_image";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og";
import { getPublishedPost } from "@/lib/posts";
import { PERSON_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const logo = await getBrandImage("logo-on-dark");

  const titleSize =
    post.title.length <= 60 ? 62 : post.title.length <= 95 ? 50 : 40;
  const excerpt = post.excerpt.replace(/\s+/g, " ").trim();
  const summary =
    excerpt.length <= 165
      ? excerpt
      : `${excerpt.slice(0, 162).replace(/\s+\S*$/, "")}…`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "60px 76px",
        background: "#0b0f10",
        color: "#edf2ef",
        border: "1px solid #293a3d",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          lineHeight: 1.2,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#80e7e7",
        }}
      >
        <img
          src={logo}
          width={430}
          height={(430 * 405) / 3217}
          alt="Consulting Wojciech Bajer"
        />
        <span>Notes</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            fontWeight: 700,
            wordBreak: "break-word",
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            lineHeight: 1.3,
            color: "#adb9bc",
            wordBreak: "break-word",
          }}
        >
          {summary}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #293a3d",
          paddingTop: 22,
          fontSize: 22,
          lineHeight: 1.2,
          color: "#80e7e7",
        }}
      >
        <span>By {PERSON_NAME}</span>
        <span>wojciechbajer.com</span>
      </div>
    </div>,
    OG_IMAGE_SIZE,
  );
}
