"use client";

import { ProcessPath } from "@/components/ProcessPath";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const steps = [
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
                  <span className="block title-rim">Assess, Design,</span>
                  <span className="block title-rim">Deliver, Operate.</span>
                </>
              }
              description="A connected delivery path—from early clarity to ongoing operations."
            />
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="process-section__body">
            <ProcessPath steps={steps} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
