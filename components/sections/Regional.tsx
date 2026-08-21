import {
  IconNetwork,
  IconPartners,
  IconPin,
  IconPower,
} from "@/components/Icons";
import { RegionalGlobeCanvas } from "@/components/RegionalGlobeCanvas";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const capabilities = [
  {
    title: "Malaysia-based",
    copy: "Delivery posture anchored in Malaysia for regional execution.",
    Icon: IconPin,
  },
  {
    title: "Southeast Asia delivery",
    copy: "Workstreams shaped for enterprise and project needs across SEA.",
    Icon: IconNetwork,
  },
  {
    title: "Partner coordination",
    copy: "Stakeholders aligned so sourcing, readiness and delivery stay connected.",
    Icon: IconPartners,
  },
  {
    title: "Sites · power · connectivity",
    copy: "Land, power and connectivity reviewed early against project context.",
    Icon: IconPower,
  },
];

export function Regional() {
  return (
    <section
      id="regional"
      className="regional-section bg-noise relative overflow-hidden bg-auramind-secondary"
      aria-labelledby="regional-heading"
    >
      <div className="page-shell relative">
        <div className="regional-layout grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="regional-copy-col order-2 flex flex-col justify-center lg:order-1 lg:py-2 lg:pr-4">
            <Reveal>
              <SectionHeading
                id="regional-heading"
                eyebrow="Regional Delivery Network"
                title={
                  <>
                    <span className="block title-rim">Connected across</span>
                    <span className="block title-rim">Southeast Asia.</span>
                  </>
                }
                description="Access to sites, power, connectivity and delivery partners—structured around each project’s requirements."
              />
            </Reveal>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-6">
              {capabilities.map((item, index) => (
                <Reveal
                  key={item.title}
                  delay={Math.min(index + 1, 3) as 1 | 2 | 3}
                >
                  <article className="border-l-2 border-auramind-yellow pl-4">
                    <div className="flex min-h-[1.5rem] items-center gap-2.5">
                      <item.Icon
                        className="h-[1.05rem] w-[1.05rem] text-auramind-black/55"
                        aria-hidden
                      />
                      <h3 className="text-base font-semibold tracking-tight text-auramind-black">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-auramind-black/65">
                      {item.copy}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal emerge delay={6} className="order-1 lg:order-2">
            <div className="regional-globe-col flex items-center justify-center lg:min-h-[28rem]">
              <div className="regional-globe-frame">
                <RegionalGlobeCanvas />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
