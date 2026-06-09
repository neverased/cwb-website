import { evaluateContactSubmission } from "@/lib/contact";
import { sendContactEmail } from "@/lib/contact_mail";

type ContactStatus = "sent" | "invalid" | "error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestWantsJson = (request: Request) => {
  return request.headers.get("accept")?.toLowerCase().includes("application/json") ?? false;
};

const contactStatusCode = (status: ContactStatus) => {
  if (status === "sent") {
    return 200;
  }

  return status === "invalid" ? 422 : 500;
};

const redirectWithStatus = (request: Request, status: ContactStatus) => {
  const redirectTarget = new URL(
    request.headers.get("referer") ?? "/contact/",
    request.url,
  );
  redirectTarget.searchParams.set("contact", status);
  redirectTarget.hash = "contact";

  return Response.redirect(redirectTarget, 303);
};

const respondWithStatus = (request: Request, status: ContactStatus) => {
  if (!requestWantsJson(request)) {
    return redirectWithStatus(request, status);
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
  const formData = await request.formData();
  const post: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    post[key] = typeof value === "string" ? value : value.name;
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
  } catch {
    return respondWithStatus(request, "error");
  }
}
