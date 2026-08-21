/**
 * Project inquiry option catalogues and submission contract.
 * Edit option arrays to update form choices without touching form logic.
 *
 * Form delivery integration lives here. Connect Google Sheets, email, or CRM
 * before production launch — see README.
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
    id: "partnership-other",
    title: "Partnership / Other",
    description:
      "For partnerships, suppliers or enquiries that do not fit the first two paths.",
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
};

/**
 * Optional public endpoint for production form delivery.
 * Set `NEXT_PUBLIC_PROJECT_INQUIRY_ENDPOINT` in the environment, or replace
 * `submitProjectInquiry` with your Sheets / email / CRM client.
 */
export const PROJECT_INQUIRY_ENDPOINT = (
  process.env.NEXT_PUBLIC_PROJECT_INQUIRY_ENDPOINT ?? ""
).trim();

/** True when a real delivery endpoint is configured. */
export const isProjectInquiryConfigured = PROJECT_INQUIRY_ENDPOINT.length > 0;

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
