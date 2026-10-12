import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Embed local artwork so metadata images work without a network request.
export const getBrandImage = async (asset: "mark" | "logo-on-dark") => {
  const image = await readFile(
    join(process.cwd(), "public", "brand", `${asset}.png`),
    "base64",
  );
  return `data:image/png;base64,${image}`;
};
