import { ImageResponse } from "next/og";

import { getBrandImage } from "@/lib/brand_image";

export const dynamic = "force-static";
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
  const mark = await getBrandImage("mark");
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0f10",
        border: "3px solid #293a3d",
      }}
    >
      <img src={mark} width={148} height={(148 * 355) / 1179} alt="" />
    </div>,
    size,
  );
}
