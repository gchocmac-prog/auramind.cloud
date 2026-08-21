interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  ALLOWED_ORIGINS: string;
  ALLOWED_HOSTNAMES: string;
  RESEND_FROM: string;
  RESEND_TO: string;
}

type InquiryPayload = {
  name: string;
  company: string;
  email: string;
  budgetRange: string;
  pathway: "ai-infrastructure" | "regional-resource" | "partnership-other";
  pathwayOptions: string[];
  partnershipDetail: string;
  projectBrief: string;
  timeline: string;
  additionalRequirements: string;
  submittedAt: string;
  turnstileToken: string;
};

type TurnstileResult = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

const MAX_BODY_BYTES = 32_768;
const TURNSTILE_ACTION = "project-inquiry";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_EMAIL_URL = "https://api.resend.com/emails";

const PATHWAYS = new Set([
  "ai-infrastructure",
  "regional-resource",
  "partnership-other",
]);
const BUDGET_RANGES = new Set([
  "",
  "below-250k",
  "250k-1m",
  "1m-5m",
  "5m-plus",
  "not-confirmed",
]);
const TIMELINES = new Set([
  "",
  "immediately",
  "1-3-months",
  "3-6-months",
  "6-months-plus",
  "exploring",
]);
const AI_OPTIONS = new Set([
  "Infrastructure planning",
  "Procurement and supply",
  "Deployment and integration",
  "Private AI systems",
  "Managed operations",
]);
const REGIONAL_OPTIONS = new Set([
  "Project or land sourcing",
  "AIDC site readiness",
  "Power and connectivity",
  "Stakeholder coordination",
  "Early opportunity structuring",
]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function csvSet(value: string): Set<string> {
  return new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(
  body: Record<string, unknown>,
  status: number,
  origin?: string,
): Response {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  if (origin) {
    for (const [key, value] of Object.entries(corsHeaders(origin))) {
      headers.set(key, value);
    }
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function cleanString(
  value: unknown,
  field: string,
  maxLength: number,
  required = false,
): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }
  const cleaned = value.trim();
  if (required && !cleaned) throw new Error(`${field} is required`);
  if (cleaned.length > maxLength) throw new Error(`${field} is too long`);
  return cleaned;
}

function parsePayload(input: unknown): InquiryPayload {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Request body must be an object");
  }

  const value = input as Record<string, unknown>;
  const name = cleanString(value.name, "name", 120, true);
  const company = cleanString(value.company, "company", 160, true);
  const email = cleanString(value.email, "email", 254, true).toLowerCase();
  const budgetRange = cleanString(value.budgetRange, "budgetRange", 40);
  const pathway = cleanString(value.pathway, "pathway", 40, true);
  const partnershipDetail = cleanString(
    value.partnershipDetail,
    "partnershipDetail",
    2_000,
  );
  const projectBrief = cleanString(
    value.projectBrief,
    "projectBrief",
    5_000,
    true,
  );
  const timeline = cleanString(value.timeline, "timeline", 40);
  const additionalRequirements = cleanString(
    value.additionalRequirements,
    "additionalRequirements",
    3_000,
  );
  const submittedAt = cleanString(value.submittedAt, "submittedAt", 40, true);
  const turnstileToken = cleanString(
    value.turnstileToken,
    "turnstileToken",
    2_048,
    true,
  );

  if (!EMAIL_PATTERN.test(email)) throw new Error("email is invalid");
  if (!BUDGET_RANGES.has(budgetRange)) throw new Error("budgetRange is invalid");
  if (!PATHWAYS.has(pathway)) throw new Error("pathway is invalid");
  if (!TIMELINES.has(timeline)) throw new Error("timeline is invalid");
  if (projectBrief.length < 12) throw new Error("projectBrief is too short");
  if (Number.isNaN(Date.parse(submittedAt))) {
    throw new Error("submittedAt is invalid");
  }
  if (!Array.isArray(value.pathwayOptions) || value.pathwayOptions.length > 10) {
    throw new Error("pathwayOptions is invalid");
  }

  const allowedOptions =
    pathway === "ai-infrastructure"
      ? AI_OPTIONS
      : pathway === "regional-resource"
        ? REGIONAL_OPTIONS
        : new Set<string>();
  const pathwayOptions = value.pathwayOptions.map((item) => {
    const option = cleanString(item, "pathwayOptions", 100, true);
    if (!allowedOptions.has(option)) throw new Error("pathwayOptions is invalid");
    return option;
  });

  return {
    name,
    company,
    email,
    budgetRange,
    pathway: pathway as InquiryPayload["pathway"],
    pathwayOptions,
    partnershipDetail,
    projectBrief,
    timeline,
    additionalRequirements,
    submittedAt,
    turnstileToken,
  };
}

async function validateTurnstile(
  token: string,
  request: Request,
  env: Env,
): Promise<boolean> {
  const formData = new FormData();
  formData.set("secret", env.TURNSTILE_SECRET_KEY);
  formData.set("response", token);
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) formData.set("remoteip", remoteIp);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) return false;

  const result = (await response.json()) as TurnstileResult;
  const allowedHostnames = csvSet(env.ALLOWED_HOSTNAMES);
  return (
    result.success === true &&
    result.action === TURNSTILE_ACTION &&
    typeof result.hostname === "string" &&
    allowedHostnames.has(result.hostname)
  );
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function label(value: string): string {
  const labels: Record<string, string> = {
    "ai-infrastructure": "AI Infrastructure Delivery",
    "regional-resource": "Regional Resource Integration",
    "partnership-other": "Partnership / Other",
    "below-250k": "Below RM250k",
    "250k-1m": "RM250k–RM1m",
    "1m-5m": "RM1m–RM5m",
    "5m-plus": "RM5m+",
    "not-confirmed": "Budget not confirmed",
    immediately: "Immediately",
    "1-3-months": "Within 1–3 months",
    "3-6-months": "Within 3–6 months",
    "6-months-plus": "More than 6 months",
    exploring: "Still exploring",
  };
  return (labels[value] ?? value) || "Not provided";
}

function row(title: string, value: string): string {
  return `<tr><th align="left" valign="top" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;width:180px">${escapeHtml(title)}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(value || "Not provided")}</td></tr>`;
}

function emailContent(payload: InquiryPayload): { subject: string; html: string; text: string } {
  const pathwayOptions = payload.pathwayOptions.join(", ") || "Not provided";
  const subjectCompany = payload.company.replace(/[\r\n]+/g, " ").slice(0, 80);
  const subject = `New Auramind enquiry — ${subjectCompany}`;
  const fields: Array<[string, string]> = [
    ["Name", payload.name],
    ["Company", payload.company],
    ["Email", payload.email],
    ["Project type", label(payload.pathway)],
    ["Engagement model", pathwayOptions],
    ["Partnership detail", payload.partnershipDetail],
    ["Project summary", payload.projectBrief],
    ["Budget range", label(payload.budgetRange)],
    ["Expected timeline", label(payload.timeline)],
    ["Additional requirements", payload.additionalRequirements],
    ["Submitted at (UTC)", payload.submittedAt],
  ];

  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#111827"><h2>New website enquiry</h2><table role="presentation" style="border-collapse:collapse;width:100%;max-width:760px">${fields.map(([title, value]) => row(title, value)).join("")}</table><p style="color:#6b7280;font-size:12px">Submitted via auramind.cloud. Replying to this email will reply to the enquirer.</p></body></html>`;
  const text = [
    "New website enquiry",
    "",
    ...fields.map(([title, value]) => `${title}: ${value || "Not provided"}`),
    "",
    "Submitted via auramind.cloud. Replying to this email will reply to the enquirer.",
  ].join("\n");

  return { subject, html, text };
}

async function idempotencyKey(payload: InquiryPayload): Promise<string> {
  const source = new TextEncoder().encode(
    `${payload.email}|${payload.submittedAt}|${payload.turnstileToken}`,
  );
  const digest = await crypto.subtle.digest("SHA-256", source);
  return `auramind-inquiry-${Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")}`;
}

async function sendEmail(payload: InquiryPayload, env: Env): Promise<boolean> {
  const content = emailContent(payload);
  const response = await fetch(RESEND_EMAIL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": await idempotencyKey(payload),
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [env.RESEND_TO],
      reply_to: payload.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    }),
  });

  if (!response.ok) {
    console.error("Resend delivery failed", { status: response.status });
    return false;
  }
  return true;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ status: "ok" }, 200);
    }
    if (url.pathname !== "/api/inquiry") {
      return json({ error: "Not found" }, 404);
    }

    const origin = request.headers.get("Origin") ?? "";
    const originAllowed = csvSet(env.ALLOWED_ORIGINS).has(origin);

    if (request.method === "OPTIONS") {
      if (!originAllowed) return json({ error: "Origin not allowed" }, 403);
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, originAllowed ? origin : undefined);
    }
    if (!originAllowed) return json({ error: "Origin not allowed" }, 403);
    if (!request.headers.get("Content-Type")?.toLowerCase().includes("application/json")) {
      return json({ error: "Content-Type must be application/json" }, 415, origin);
    }

    const declaredLength = Number(request.headers.get("Content-Length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return json({ error: "Request body is too large" }, 413, origin);
    }

    try {
      const bodyText = await request.text();
      if (new TextEncoder().encode(bodyText).byteLength > MAX_BODY_BYTES) {
        return json({ error: "Request body is too large" }, 413, origin);
      }

      let decoded: unknown;
      try {
        decoded = JSON.parse(bodyText);
      } catch {
        return json({ error: "Invalid JSON" }, 400, origin);
      }

      let payload: InquiryPayload;
      try {
        payload = parsePayload(decoded);
      } catch {
        return json({ error: "Invalid form data" }, 400, origin);
      }

      if (!(await validateTurnstile(payload.turnstileToken, request, env))) {
        return json({ error: "Security verification failed" }, 400, origin);
      }
      if (!(await sendEmail(payload, env))) {
        return json({ error: "Email delivery failed" }, 502, origin);
      }

      return json({ ok: true }, 200, origin);
    } catch {
      console.error("Unexpected inquiry worker failure");
      return json({ error: "Internal server error" }, 500, origin);
    }
  },
} satisfies ExportedHandler<Env>;
