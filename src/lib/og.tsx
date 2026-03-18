import { ImageResponse } from "next/og";

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

export const createOgImage = ({
  eyebrow,
  title,
  summary,
  terminalPath,
}: CreateOgImageOptions) =>
  new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top left, rgba(116,255,191,0.16), transparent 28%), linear-gradient(180deg, #020807 0%, #041111 48%, #020807 100%)",
          color: "#f4fff8",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.24,
            backgroundImage:
              "linear-gradient(90deg, rgba(126,255,203,0.08) 1px, transparent 1px), linear-gradient(rgba(126,255,203,0.06) 1px, transparent 1px)",
            backgroundSize: "58px 58px",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 28,
            borderRadius: 34,
            border: "1px solid rgba(126,255,203,0.16)",
            background:
              "linear-gradient(180deg, rgba(10,18,17,0.9), rgba(4,11,11,0.97))",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.24)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 54,
            borderRadius: 24,
            border: "1px solid rgba(126,255,203,0.08)",
            background:
              "repeating-linear-gradient(180deg, rgba(126,255,203,0.04), rgba(126,255,203,0.04) 1px, transparent 1px, transparent 4px)",
            opacity: 0.34,
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "74px 86px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8ddfba",
            }}
          >
            <div style={{ display: "flex" }}>{eyebrow}</div>
            <div style={{ display: "flex", color: "#d9ff8c" }}>{terminalPath}</div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              maxWidth: 930,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 82,
                lineHeight: 0.96,
                letterSpacing: "-0.06em",
                fontWeight: 700,
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                maxWidth: 860,
                color: "rgba(228,246,236,0.82)",
                fontSize: 28,
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
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(228,246,236,0.72)",
              }}
            >
              multimedia / software / architecture / audits
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                minHeight: 54,
                padding: "0 24px",
                borderRadius: 999,
                border: "1px solid rgba(126,255,203,0.2)",
                background: "rgba(126,255,203,0.06)",
                color: "#f4fff8",
                fontSize: 20,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              wojciechbajer.com
            </div>
          </div>
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
