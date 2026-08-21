import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const deliverables = [
  {
    title: "Architecture pack",
    copy: "A structured view of infrastructure choices, constraints and intended system shape.",
  },
  {
    title: "Implementation plan",
    copy: "Sequenced delivery steps covering procurement, deployment and integration.",
  },
  {
    title: "Operating playbook",
    copy: "Practical guidance for day-to-day ownership once systems are live.",
  },
  {
    title: "Status visibility",
    copy: "Clear progress signals so stakeholders stay aligned through delivery.",
  },
  {
    title: "Opportunity pack",
    copy: "Early structuring materials for regional sites, resources and project options.",
  },
];

export function Deliverables() {
  return (
    <section
      className="relative overflow-hidden bg-auramind-black pt-[calc(var(--space-section)-0.75rem)] pb-[var(--space-section)] text-auramind-white"
      aria-labelledby="deliverables-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full border-[18px] border-white/5"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-auramind-yellow/15 blur-3xl"
      />

      <div className="page-shell relative">
        <Reveal>
          <SectionHeading
            id="deliverables-heading"
            dark
            align="center"
            eyebrow="Client deliverables"
            title="Tangible outputs, not vague promises."
            description="Concrete materials stakeholders can use, review and act on."
            descriptionClassName="mx-auto max-w-md"
          />
        </Reveal>

        <ol className="deliverables-list mt-9 border-y border-white/18">
          {deliverables.map((item, index) => (
            <Reveal
              key={item.title}
              delay={(Math.min(index, 3) || 0) as 0 | 1 | 2 | 3}
            >
              <li className="deliverables-row">
                <span className="font-display text-2xl text-auramind-yellow">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-auramind-silver sm:text-base">
                  {item.copy}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
