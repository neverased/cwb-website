import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(scriptDir, "../out");
const PNG_ROUTE_BASENAMES = new Set(["opengraph-image", "icon", "apple-icon"]);

const ensurePngCopies = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await ensurePngCopies(fullPath);
        return;
      }

      if (!entry.isFile() || !PNG_ROUTE_BASENAMES.has(entry.name)) {
        return;
      }

      const pngPath = `${fullPath}.png`;
      await mkdir(path.dirname(pngPath), { recursive: true });
      await copyFile(fullPath, pngPath);
    }),
  );
};

await ensurePngCopies(outDir);
