import { ImageResponse } from "next/og";

import { getBrandImage } from "@/lib/brand_image";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_IMAGE_CONTENT_TYPE = "image/png";

interface CreateOgImageOptions {
  eyebrow: string;
  title: string;
  summary: string;
  terminalPath: string;
}

export const createOgImage = async ({
  eyebrow,
  title,
  summary,
  terminalPath,
}: CreateOgImageOptions) => {
  const logo = await getBrandImage("logo-on-dark");

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "58px 72px",
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
        }}
      >
        <img
          src={logo}
          width={430}
          height={(430 * 405) / 3217}
          alt="Consulting Wojciech Bajer"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#80e7e7",
            }}
          >
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: 15, color: "#8f9fa3" }}>
            {terminalPath}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 1030,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 62 : 70,
            lineHeight: 1.06,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 1000,
            color: "#adb9bc",
            fontSize: 25,
            lineHeight: 1.4,
          }}
        >
          {summary}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #293a3d",
          paddingTop: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8f9fa3",
          }}
        >
          media / software / architecture / audits / leadership / ai
        </div>
        <div
          style={{
            display: "flex",
            color: "#80e7e7",
            fontSize: 20,
          }}
        >
          wojciechbajer.com
        </div>
      </div>
    </div>,
    OG_IMAGE_SIZE,
  );
};
