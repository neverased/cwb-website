import { CONTACT_FIELD_LIMITS, evaluateContactSubmission } from "@/lib/contact";
import { sendContactEmail } from "@/lib/contact_mail";

type ContactStatus = "sent" | "invalid" | "error";
const MAX_CONTACT_BODY_BYTES = 96 * 1024;
class InvalidContactSubmission extends Error {}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestWantsJson = (request: Request) => {
  return (
    request.headers.get("accept")?.toLowerCase().includes("application/json") ??
    false
  );
};

const contactStatusCode = (status: ContactStatus) => {
  if (status === "sent") {
    return 200;
  }

  return status === "invalid" ? 422 : 500;
};

const redirectWithStatus = (status: ContactStatus) =>
  new Response(null, {
    status: 303,
    headers: { Location: `/contact/?contact=${status}#contact` },
  });

const respondWithStatus = (request: Request, status: ContactStatus) => {
  if (!requestWantsJson(request)) {
    return redirectWithStatus(status);
  }

  return Response.json(
    {
      status,
    },
    {
      status: contactStatusCode(status),
    },
  );
};

const getRequestRemoteAddress = (request: Request) => {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
};

const formDataToContactPost = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? "";
  const mediaType = contentType.split(";", 1)[0].trim().toLowerCase();
  const length = request.headers.get("content-length");
  if (
    !["multipart/form-data", "application/x-www-form-urlencoded"].includes(
      mediaType,
    ) ||
    (length !== null &&
      (!/^\d+$/.test(length) || Number(length) > MAX_CONTACT_BODY_BYTES))
  ) {
    await request.body?.cancel();
    throw new InvalidContactSubmission();
  }
  const reader = request.body?.getReader();
  if (!reader) throw new InvalidContactSubmission();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_CONTACT_BODY_BYTES) {
        await reader.cancel();
        throw new InvalidContactSubmission();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  let formData: FormData;
  try {
    formData = await new Response(Buffer.concat(chunks), {
      headers: { "content-type": contentType },
    }).formData();
  } catch {
    throw new InvalidContactSubmission();
  }
  const post: Record<string, string> = Object.create(null);

  for (const [key, value] of formData.entries()) {
    if (
      !Object.hasOwn(CONTACT_FIELD_LIMITS, key) ||
      Object.hasOwn(post, key) ||
      typeof value !== "string" ||
      value.length >
        2 * CONTACT_FIELD_LIMITS[key as keyof typeof CONTACT_FIELD_LIMITS]
    ) {
      throw new InvalidContactSubmission();
    }
    post[key] = value;
  }

  return post;
};

export async function POST(request: Request) {
  try {
    const evaluation = await evaluateContactSubmission(
      {
        remoteAddress: getRequestRemoteAddress(request),
        userAgent: request.headers.get("user-agent") ?? "unknown",
      },
      await formDataToContactPost(request),
    );

    if (evaluation.classification === "reject") {
      return respondWithStatus(request, "invalid");
    }

    if (evaluation.classification === "quarantine") {
      return respondWithStatus(request, "sent");
    }

    await sendContactEmail(evaluation);

    return respondWithStatus(request, "sent");
  } catch (error) {
    return respondWithStatus(
      request,
      error instanceof InvalidContactSubmission ? "invalid" : "error",
    );
  }
}
