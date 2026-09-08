import config from "@payload-config";
import { getPayload } from "payload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    await payload.count({ collection: "posts", overrideAccess: false });
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
