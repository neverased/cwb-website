import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top left, rgba(116,255,191,0.22), transparent 30%), linear-gradient(180deg, #03100f 0%, #041111 100%)",
          color: "#f4fff8",
          borderRadius: 112,
          border: "14px solid rgba(126,255,203,0.18)",
          fontSize: 200,
          fontWeight: 700,
          letterSpacing: "-0.08em",
        }}
      >
        WB
      </div>
    ),
    size,
  );
}
