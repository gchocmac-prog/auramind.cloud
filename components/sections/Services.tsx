import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

type Pathway = {
  index: string;
  tag: string;
  audience: string;
  title: string;
  lead: string;
  items: string[];
};

const pathways: Pathway[] = [
  {
    index: "Pathway 01",
    tag: "Delivery",
    audience: "For enterprises and technology teams",
    title: "AI Infrastructure Delivery",
    lead: "Planning through deployment, private AI systems and managed operations.",
    items: [
      "Infrastructure planning",
      "Procurement and supply coordination",
      "Deployment and integration",
      "Private AI systems",
      "Managed operations",
      "Lifecycle support",
    ],
  },
  {
    index: "Pathway 02",
    tag: "Integration",
    audience: "For investors, operators and project stakeholders",
    title: "Regional Resource Integration",
    lead: "Land, power, connectivity and early opportunity structuring.",
    items: [
      "Project and land sourcing",
      "AIDC site readiness screening",
      "Power and connectivity review",
      "Stakeholder coordination",
      "Early opportunity structuring",
    ],
  },
  {
    index: "Pathway 03",
    tag: "ITAD",
    audience: "For IT, security, finance and ESG teams retiring IT assets",
    title: "ITAD Product Resale",
    lead: "We resell established ITAD products — data erasure and asset disposition software — to organisations across the region.",
    items: [
      "ITAD product selection and licensing",
      "Certified data erasure software",
      "Asset disposition and audit platforms",
      "Certificates and audit trail",
      "Procurement and supply coordination",
      "Local delivery and support",
    ],
  },
  {
    index: "Pathway 04",
    tag: "Digital",
    audience: "For businesses that need a digital presence that performs",
    title: "AI Website Design & Development",
    lead: "An AI-enabled website that converts, performs and stays compliant.",
    items: [
      "Conversion-focused UX/UI and responsive design",
      "AI customer assistant",
      "Intelligent search and personalised content",
      "SEO, analytics and Core Web Vitals",
      "PDPA-compliant data handling and consent",
      "Managed deployment and ongoing optimisation",
    ],
  },
];

const accentRing = (
  <>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[14px] border-white/15"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-10 right-8 h-16 w-16 rounded-full border-[6px] border-auramind-yellow"
    />
  </>
);

const mutedRing = (
  <>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full border-[12px] border-auramind-black/10"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-8 top-10 h-20 w-20 rounded-full border-[8px] border-auramind-silver"
    />
  </>
);

export function Services() {
  return (
    <section
      id="services"
      className="bg-noise relative overflow-hidden bg-auramind-deep py-[var(--space-section)]"
      aria-labelledby="services-heading"
    >
      <div
        aria-hidden="true"
        className="section-atmosphere pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full border border-auramind-silver/35"
      />

      <div className="page-shell relative">
        <Reveal>
          <SectionHeading
            id="services-heading"
            eyebrow="Services"
            title={
              <span className="title-rim">
                Four primary delivery pathways.
              </span>
            }
            description="Infrastructure delivery, regional resource integration, IT asset disposition and digital delivery — coordinated as one partner."
          />
        </Reveal>

        <div className="pathway-grid pathway-grid--quad mt-10">
          {pathways.map((pathway, position) => {
            const primary = position % 2 === 0;
            const headingId = `service-${position + 1}-heading`;
            return (
              <Reveal key={pathway.title} delay={1} className="h-full">
                <article
                  aria-labelledby={headingId}
                  className={
                    primary
                      ? "pathway-card pathway-card--primary relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-auramind-black px-7 py-9 text-auramind-white sm:px-9 sm:py-10"
                      : "pathway-card pathway-card--secondary relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-auramind-black/12 bg-auramind-elevated px-7 py-9 sm:px-9 sm:py-10"
                  }
                >
                  {primary ? accentRing : mutedRing}

                  <div className="relative z-10 flex flex-wrap items-center gap-2.5">
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        primary
                          ? "text-auramind-silver"
                          : "text-auramind-black/50"
                      }`}
                    >
                      {pathway.index}
                    </p>
                    <span
                      className={
                        primary
                          ? "rounded-full border border-auramind-yellow/45 bg-auramind-yellow/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-auramind-yellow"
                          : "rounded-full border border-auramind-black/15 bg-auramind-black/[0.04] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-auramind-black/70"
                      }
                    >
                      {pathway.tag}
                    </span>
                  </div>

                  <h3
                    id={headingId}
                    className={`relative z-10 mt-4 text-2xl font-semibold tracking-tight sm:text-3xl ${
                      primary ? "" : "text-auramind-black"
                    }`}
                  >
                    {pathway.title}
                  </h3>
                  <p
                    className={`relative z-10 mt-2 text-sm font-medium ${
                      primary ? "text-white/80" : "text-auramind-black/75"
                    }`}
                  >
                    {pathway.audience}
                  </p>
                  <p
                    className={`relative z-10 mt-3 text-sm leading-relaxed sm:text-base ${
                      primary
                        ? "text-auramind-silver"
                        : "text-auramind-black/65"
                    }`}
                  >
                    {pathway.lead}
                  </p>

                  <ul
                    className={`relative z-10 mt-auto space-y-3.5 border-t pt-8 ${
                      primary ? "border-white/15" : "border-auramind-black/12"
                    }`}
                  >
                    {pathway.items.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-3 text-sm sm:text-base ${
                          primary ? "" : "text-auramind-black"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            primary ? "bg-auramind-yellow" : "bg-auramind-black"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
