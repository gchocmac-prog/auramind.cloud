"use client";

import { Logo } from "@/components/Logo";
import { ProjectInquiryForm } from "@/components/ProjectInquiryForm";
import { Reveal } from "@/components/Reveal";

export function FinalCta() {
  return (
    <section
      id="project-inquiry"
      className="bg-noise relative overflow-x-clip overflow-y-visible bg-auramind-deep py-[var(--space-section)]"
      aria-labelledby="contact-heading"
    >
      {/* Legacy Contact / Discuss anchors resolve here */}
      <div id="contact" className="pointer-events-none absolute -top-24 h-px w-px" />

      <div
        aria-hidden="true"
        className="section-atmosphere pointer-events-none absolute inset-0"
      />

      <div className="page-shell relative">
        <Reveal className="final-cta-reveal">
          <div className="final-cta-shell relative">
            <div className="final-cta-ambient" aria-hidden="true" />

            <div className="final-cta-card relative overflow-hidden rounded-[2rem] bg-auramind-black px-6 py-10 text-auramind-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div
                className="final-cta-seq final-cta-seq--rings"
                aria-hidden="true"
              >
                <div className="final-cta-orbit final-cta-orbit--a">
                  <div className="final-cta-orbit__ring final-cta-orbit__ring--thick border-white/22" />
                </div>
                <div className="final-cta-orbit final-cta-orbit--b">
                  <div className="final-cta-orbit__ring final-cta-orbit__ring--thin border-auramind-silver/45" />
                </div>
                <div className="final-cta-orbit final-cta-orbit--c">
                  <div className="final-cta-orbit__ring final-cta-orbit__ring--mid border-white/14" />
                </div>
                <div className="final-cta-orbit-dot" />
              </div>

              <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-12 xl:gap-14">
                <div className="final-cta-seq final-cta-seq--copy max-w-xl">
                  <Logo variant="white" size={40} className="mb-7" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-auramind-silver">
                    Next step
                  </p>
                  <h2
                    id="contact-heading"
                    className="font-display title-rim-on-dark mt-4 text-[clamp(2rem,1.1rem+2.2vw,3.25rem)] font-bold leading-[1.08] tracking-tight"
                  >
                    <span className="block">Ready to structure</span>
                    <span className="block">your AI infrastructure</span>
                    <span className="block">workstream?</span>
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-auramind-silver sm:text-lg">
                    Share your requirements through the project enquiry form.
                    We use it to understand pathway, constraints and urgency
                    before we reply.
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-auramind-silver/90">
                    Built for project owners, investors, developers and
                    technology partners.
                  </p>

                  <div className="mt-8 border-t border-white/12 pt-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-auramind-yellow">
                      After you submit
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-auramind-silver sm:text-[0.95rem]">
                      <li className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-auramind-yellow"
                        />
                        <span>
                          We review pathway, budget band and site context.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-auramind-yellow"
                        />
                        <span>
                          You receive a clear next-step reply—not a generic
                          sales sequence.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-auramind-yellow"
                        />
                        <span>
                          If there is fit, we propose the right delivery
                          conversation.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="final-cta-seq final-cta-seq--actions min-w-0">
                  <div className="inquiry-panel">
                    <ProjectInquiryForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
