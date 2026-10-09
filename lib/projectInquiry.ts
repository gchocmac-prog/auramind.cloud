/**
 * Project inquiry option catalogues and submission contract.
 * Edit option arrays to update form choices without touching form logic.
 *
 * Form delivery integration lives here. The production endpoint is a
 * Cloudflare Worker that validates Turnstile and relays via Resend.
 */

export const BUDGET_RANGES = [
  { value: "below-250k", label: "Below RM250k" },
  { value: "250k-1m", label: "RM250k–RM1m" },
  { value: "1m-5m", label: "RM1m–RM5m" },
  { value: "5m-plus", label: "RM5m+" },
  { value: "not-confirmed", label: "Budget not confirmed" },
] as const;

export const TIMELINES = [
  { value: "immediately", label: "Immediately" },
  { value: "1-3-months", label: "Within 1–3 months" },
  { value: "3-6-months", label: "Within 3–6 months" },
  { value: "6-months-plus", label: "More than 6 months" },
  { value: "exploring", label: "Still exploring" },
] as const;

export type PathwayId =
  | "ai-infrastructure"
  | "regional-resource"
  | "itad"
  | "digital-website"
  | "partnership-other";

export const PATHWAYS: {
  id: PathwayId;
  title: string;
  description: string;
}[] = [
  {
    id: "ai-infrastructure",
    title: "AI Infrastructure Delivery",
    description: "For enterprises and technology teams.",
  },
  {
    id: "regional-resource",
    title: "Regional Resource Integration",
    description: "For investors, operators and project stakeholders.",
  },
  {
    id: "itad",
    title: "ITAD Product Resale",
    description:
      "For IT, security, finance and ESG teams seeking ITAD products.",
  },
  {
    id: "digital-website",
    title: "AI Website Design & Development",
    description: "For businesses that need a digital presence that performs.",
  },
  {
    id: "partnership-other",
    title: "Partnership / Other",
    description:
      "For partnerships, suppliers or enquiries that do not fit the other paths.",
  },
];

export const AI_INFRASTRUCTURE_OPTIONS = [
  "Infrastructure planning",
  "Procurement and supply",
  "Deployment and integration",
  "Private AI systems",
  "Managed operations",
] as const;

export const REGIONAL_RESOURCE_OPTIONS = [
  "Project or land sourcing",
  "AIDC site readiness",
  "Power and connectivity",
  "Stakeholder coordination",
  "Early opportunity structuring",
] as const;

export const ITAD_OPTIONS = [
  "ITAD product selection and licensing",
  "Certified data erasure software",
  "Asset disposition and audit platforms",
  "Certificates and audit trail",
  "Procurement and supply coordination",
  "Local delivery and support",
] as const;

export const DIGITAL_WEBSITE_OPTIONS = [
  "UX/UI and responsive design",
  "AI customer assistant",
  "Intelligent search",
  "SEO, analytics and Core Web Vitals",
  "PDPA-aligned data handling",
  "Managed deployment and optimisation",
] as const;

/**
 * Engagement-model chips offered for each pathway.
 * The Worker mirrors this mapping; keep both in sync when editing.
 */
export const PATHWAY_OPTIONS: Record<PathwayId, readonly string[]> = {
  "ai-infrastructure": AI_INFRASTRUCTURE_OPTIONS,
  "regional-resource": REGIONAL_RESOURCE_OPTIONS,
  itad: ITAD_OPTIONS,
  "digital-website": DIGITAL_WEBSITE_OPTIONS,
  "partnership-other": [],
};

/**
 * Stable payload contract for Google Sheets, email, or CRM integrations.
 * Keep field names stable when wiring a production endpoint.
 */
export type ProjectInquiryPayload = {
  name: string;
  company: string;
  email: string;
  budgetRange: string;
  pathway: PathwayId;
  pathwayOptions: string[];
  partnershipDetail: string;
  projectBrief: string;
  timeline: string;
  additionalRequirements: string;
  submittedAt: string;
  /** Visitor acknowledged the privacy notice (PDPA consent). */
  consentGiven: boolean;
  /** Privacy notice version shown at the point of consent. */
  consentVersion: string;
  /** ISO timestamp marking when consent was recorded on the client. */
  consentAt: string;
  turnstileToken: string;
};

/**
 * Version of the privacy notice the form links to. Bump this whenever the
 * notice materially changes so stored consents remain attributable.
 */
export const PRIVACY_NOTICE_VERSION = "2026-10-09";
export const PRIVACY_NOTICE_PATH = "/privacy";

/**
 * Optional public endpoint for production form delivery.
 * Set `NEXT_PUBLIC_PROJECT_INQUIRY_ENDPOINT` in the environment, or replace
 * `submitProjectInquiry` with your Sheets / email / CRM client.
 */
export const PROJECT_INQUIRY_ENDPOINT = (
  process.env.NEXT_PUBLIC_PROJECT_INQUIRY_ENDPOINT ?? ""
).trim();

/** Public Cloudflare Turnstile site key. Safe to expose in browser code. */
export const TURNSTILE_SITE_KEY = (
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""
).trim();

/** True when both delivery and anti-abuse controls are configured. */
export const isProjectInquiryConfigured =
  PROJECT_INQUIRY_ENDPOINT.length > 0 && TURNSTILE_SITE_KEY.length > 0;

/**
 * Submit a validated project enquiry.
 * Throws when no endpoint is configured so the UI never reports a false success.
 */
export async function submitProjectInquiry(
  payload: ProjectInquiryPayload,
): Promise<void> {
  if (!isProjectInquiryConfigured) {
    throw new Error(
      "Project inquiry endpoint is not configured. Connect form delivery before launch.",
    );
  }

  const response = await fetch(PROJECT_INQUIRY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Inquiry submission failed (${response.status})`);
  }
}
