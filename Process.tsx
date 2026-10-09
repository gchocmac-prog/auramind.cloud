"use client";

import { ProcessPath } from "@/components/ProcessPath";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const infrastructureSteps = [
  {
    name: "Assess",
    description:
      "Clarify requirements, constraints and readiness across infrastructure and regional context.",
    output: "Requirements & readiness brief",
  },
  {
    name: "Design",
    description:
      "Shape the delivery strategy, structure, priorities and implementation direction.",
    output: "Delivery strategy & project structure",
  },
  {
    name: "Deliver",
    description:
      "Coordinate execution across partners, systems and milestones to move the project forward.",
    output: "Active delivery & execution progress",
  },
  {
    name: "Operate",
    description:
      "Sustain operations, handover, support and continuity into long-term use.",
    output: "Operational continuity & support",
  },
];

const itadSteps = [
  {
    name: "Inventory",
    description:
      "Record every asset, owner, location and data-bearing component against a documented baseline.",
    output: "Asset register & chain-of-custody record",
  },
  {
    name: "Sanitise",
    description:
      "Erase or destroy data on every data-bearing medium through a supervised, documented process.",
    output: "Data sanitisation record",
  },
  {
    name: "Recover",
    description:
      "Test, refurbish and remarket serviceable assets to recover residual value where a market exists.",
    output: "Value-recovery report",
  },
  {
    name: "Certify",
    description:
      "Route non-recoverable equipment to compliant recycling and close the file with documentation.",
    output: "Certificate & disposal documentation",
  },
];

const digitalSteps = [
  {
    name: "Assess",
    description:
      "Clarify business goals, digital baseline and the questions the site must answer.",
    output: "Requirements & scope brief",
  },
  {
    name: "Design",
    description: "Define website scope, KPIs, architecture and content structure.",
    output: "Delivery strategy & structure",
  },
  {
    name: "Deliver",
    description:
      "Build the website and AI features, then validate performance and compliance.",
    output: "Live website & validated insight",
  },
  {
    name: "Optimize",
    description: "Measure, validate and iterate so the site keeps improving.",
    output: "Performance dashboard & roadmap",
  },
];

export function Process() {
  return (
    <section
      id="how-we-work"
      className="process-section bg-noise relative overflow-hidden bg-auramind-primary"
      aria-labelledby="process-heading"
    >
      <div className="page-shell relative">
        <Reveal>
          <div className="process-heading">
            <SectionHeading
              id="process-heading"
              align="center"
              eyebrow="How We Work"
              titleClassName="process-heading__title"
              descriptionClassName="process-heading__desc"
              title={
                <>
                  <span className="block title-rim">Business</span>
                  <span className="block title-rim">Philosophy</span>
                </>
              }
              description="A connected delivery path—from early clarity to ongoing operations."
            />
          </div>
        </Reveal>

        <div className="process-section__body">
          <Reveal delay={1}>
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-auramind-black/55">
              AI Infrastructure
            </p>
            <div className="process-section__body">
              <ProcessPath steps={infrastructureSteps} />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 sm:mt-14 lg:mt-16">
          <Reveal delay={1}>
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-auramind-black/55">
              IT Assets Disposition
            </p>
            <div className="process-section__body">
              <ProcessPath steps={itadSteps} />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 sm:mt-14 lg:mt-16">
          <Reveal delay={1}>
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-auramind-black/55">
              AI Website Design &amp; Development
            </p>
            <div className="process-section__body">
              <ProcessPath steps={digitalSteps} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
