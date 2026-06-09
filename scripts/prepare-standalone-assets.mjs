import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const standaloneDir = path.resolve(".next/standalone");
const standaloneNextDir = path.join(standaloneDir, ".next");
const standalonePublicDir = path.join(standaloneDir, "public");
const standaloneStaticDir = path.join(standaloneNextDir, "static");

await mkdir(standaloneNextDir, { recursive: true });
await rm(standalonePublicDir, { recursive: true, force: true });
await rm(standaloneStaticDir, { recursive: true, force: true });
await cp("public", standalonePublicDir, { recursive: true });
await cp(".next/static", standaloneStaticDir, { recursive: true });
