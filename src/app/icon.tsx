import { ImageResponse } from "next/og";

import { getBrandImage } from "@/lib/brand_image";

export const dynamic = "force-static";
export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default async function Icon() {
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
        borderRadius: 112,
        border: "8px solid #293a3d",
      }}
    >
      <img src={mark} width={416} height={(416 * 355) / 1179} alt="" />
    </div>,
    size,
  );
}
