import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const researchItems = [
  "Market and competitor analysis",
  "Customer segmentation",
  "Sentiment and topic analysis",
  "Pricing and channel validation",
  "Actionable roadmap from insight",
];

const websiteItems = [
  "Conversion-focused UX/UI and responsive design",
  "AI customer assistant — 7×24 enquiries and lead capture",
  "Intelligent search and personalised content",
  "SEO, analytics and Core Web Vitals performance",
  "PDPA-compliant data handling and consent",
  "Managed deployment and ongoing optimisation",
];

export function BusinessIntegration() {
  return (
    <section
      id="marketing-integration"
      className="bg-noise relative overflow-hidden bg-auramind-secondary py-[var(--space-section)]"
      aria-labelledby="marketing-integration-heading"
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
            id="marketing-integration-heading"
            eyebrow="Business AI Integration"
            title={
              <span className="title-rim">Marketing and Integration.</span>
            }
            description="Two integrated capabilities—an AI-enabled website and data-backed market research—delivered as one engagement."
          />
        </Reveal>

        <div className="pathway-grid mt-10">
          <Reveal delay={1}>
            <article className="pathway-card pathway-card--primary relative flex flex-col overflow-hidden rounded-[2rem] bg-auramind-black px-7 py-9 text-auramind-white sm:px-9 sm:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[14px] border-white/15"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-10 right-8 h-16 w-16 rounded-full border-[6px] border-auramind-yellow"
              />

              <div className="relative z-10 flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-auramind-silver">
                  Business 01
                </p>
                <span className="rounded-full border border-auramind-yellow/45 bg-auramind-yellow/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-auramind-yellow">
                  Research
                </span>
              </div>
              <h3 className="relative z-10 mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                AI Market Research & Intelligence
              </h3>
              <p className="relative z-10 mt-2 text-sm font-medium text-white/80">
                For teams that want decisions validated by data, not guesswork.
              </p>

              <ul className="relative z-10 space-y-3.5 border-t border-white/15 pt-8">
                {researchItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm sm:text-base"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-auramind-yellow"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={2}>
            <article className="pathway-card pathway-card--secondary relative flex flex-col overflow-hidden rounded-[2rem] border border-auramind-black/12 bg-auramind-elevated px-7 py-9 sm:px-9 sm:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full border-[12px] border-auramind-black/10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-8 top-10 h-20 w-20 rounded-full border-[8px] border-auramind-silver"
              />

              <div className="relative z-10 flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-auramind-black/50">
                  Business 02
                </p>
                <span className="rounded-full border border-auramind-black/15 bg-auramind-black/[0.04] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-auramind-black/70">
                  Website
                </span>
              </div>
              <h3 className="relative z-10 mt-4 text-2xl font-semibold tracking-tight text-auramind-black sm:text-3xl">
                AI Website Design & Development
              </h3>
              <p className="relative z-10 mt-2 text-sm font-medium text-auramind-black/75">
                For businesses that need a digital presence that performs.
              </p>

              <ul className="relative z-10 space-y-3.5 border-t border-auramind-black/12 pt-8">
                {websiteItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-auramind-black sm:text-base"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-auramind-black"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
