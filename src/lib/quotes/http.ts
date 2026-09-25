import { type NextRequest, NextResponse } from "next/server";

import { QUOTE_PRIVATE_HEADERS } from "./server";

export function quoteJson(
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: { ...QUOTE_PRIVATE_HEADERS, ...extra },
  });
}

export function sameQuoteOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const configured = process.env.PAYLOAD_PUBLIC_SERVER_URL;
  const expected = configured
    ? new URL(configured).origin
    : request.nextUrl.origin;
  return (
    origin === expected &&
    request.headers.get("sec-fetch-site") !== "cross-site"
  );
}

export async function readQuoteJson(
  request: NextRequest,
): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("JSON required");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Body required");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        throw new Error("Body too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new Error("Object required");
  return data as Record<string, unknown>;
}

export type QuoteRouteContext = { params: Promise<{ publicId: string }> };
