"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { Button } from "@/components/Button";

const pillars = [
  {
    title: "Execution-led",
    copy: "Requirements become structured delivery workstreams—from planning through managed operations.",
  },
  {
    title: "Vendor-neutral",
    copy: "Decisions stay grounded in project fit, not a single stack or supplier agenda.",
  },
  {
    title: "Regionally connected",
    copy: "Sites, power, connectivity and project partners coordinated across Southeast Asia.",
  },
];

type HeroProps = {
  scrollProgress?: number;
  phase1?: number;
  phase2?: number;
  reduceMotionStack?: boolean;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Soft scale-up + fade for phase-2 storytelling beats. */
function storyReveal(progress: number, start: number, end: number) {
  const t = smoothstep(start, end, progress);
  return {
    opacity: t,
    transform: `translate3d(0, ${(1 - t) * 0.85}rem, 0) scale(${0.94 + t * 0.06})`,
  } satisfies CSSProperties;
}

export function Hero({
  scrollProgress = 0,
  phase1 = 1,
  phase2 = 0,
  reduceMotionStack = false,
}: HeroProps) {
  const [ready, setReady] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReduced(reduced.matches);
    sync();
    reduced.addEventListener("change", sync);
    const enter = window.requestAnimationFrame(() => setReady(true));
    return () => {
      window.cancelAnimationFrame(enter);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  const p = prefersReduced || reduceMotionStack ? 0 : scrollProgress;
  const p1 = reduceMotionStack ? 1 : phase1;
  const p2 = reduceMotionStack ? 1 : phase2;
  const story = reduceMotionStack || prefersReduced;

  // Sequential beats once the company layer is entering / holding.
  const revealEyebrow = story ? 1 : storyReveal(p, 0.38, 0.46);
  const revealHeading = story ? 1 : storyReveal(p, 0.42, 0.5);
  const revealSupport = story ? 1 : storyReveal(p, 0.46, 0.54);
  const revealPillars = [
    story ? 1 : storyReveal(p, 0.5, 0.58),
    story ? 1 : storyReveal(p, 0.56, 0.64),
    story ? 1 : storyReveal(p, 0.62, 0.7),
  ];

  const fullRevealStyle = (value: number | CSSProperties): CSSProperties =>
    typeof value === "number"
      ? { opacity: 1, transform: "none" }
      : value;

  return (
    <div
      id="top"
      className={`hero-stage hero-stage--dark relative isolate flex h-full min-h-[100svh] flex-col overflow-hidden ${
        reduceMotionStack ? "hero-stage--stacked" : ""
      } ${ready || prefersReduced ? "is-ready" : ""} ${
        prefersReduced || reduceMotionStack ? "" : "has-orbit-motion"
      }`}
      style={
        {
          "--hero-p": p,
          "--hero-phase1": p1,
          "--hero-phase2": p2,
        } as CSSProperties
      }
      aria-label="Auramind introduction and company positioning"
    >
      <div className="hero-media" aria-hidden="true">
        <Image
          src="/images/hero-space.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-media__image"
        />
        <div className="hero-media__charcoal" />
        <div className="hero-media__gradient" />
        <div className="hero-media__phase2-veil" />
        <div className="hero-media__dive" />
      </div>

      <svg
        className="hero-orbit-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMaxYMid slice"
        aria-hidden="true"
      >
        <ellipse
          className="hero-orbit-line hero-orbit-line--a"
          cx="72"
          cy="52"
          rx="38"
          ry="26"
          transform="rotate(-14 72 52)"
        />
        <ellipse
          className="hero-orbit-line hero-orbit-line--b"
          cx="72"
          cy="52"
          rx="24"
          ry="16"
          transform="rotate(-14 72 52)"
        />
      </svg>

      <div className="hero-phases relative z-20 mx-auto h-full w-full max-w-[var(--container)]">
        <div
          className="hero-phase hero-phase--intro"
          style={{
            opacity: p1,
            zIndex: p1 >= p2 ? 3 : 1,
            visibility: p1 < 0.03 ? "hidden" : "visible",
            pointerEvents: p1 < 0.2 ? "none" : "auto",
          }}
          aria-hidden={p1 < 0.15}
        >
          <div className="hero-phase__inner">
            <div className="hero-copy w-full max-w-none lg:max-w-[min(62%,44rem)] xl:max-w-[min(64%,48rem)]">
              <p className="hero-enter hero-enter--eyebrow mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                Malaysia-based · Southeast Asia delivery
              </p>
              <h1
                id="hero-heading"
                className="hero-heading hero-enter hero-enter--title"
              >
                <span className="hero-line">
                  <span className="hero-emphasis hero-emphasis--silver">AI</span>{" "}
                  Infrastructure,
                </span>
                <span className="hero-line">Delivered Across</span>
                <span className="hero-line">
                  <span className="hero-emphasis hero-emphasis--accent">
                    Southeast Asia
                  </span>
                  .
                </span>
              </h1>
              <p className="hero-body hero-enter hero-enter--body mt-6 text-[0.95rem] sm:text-base">
                Auramind coordinates the planning, procurement, deployment and
                operation of AI infrastructure while connecting regional sites,
                resources and project partners.
              </p>
              <div className="hero-enter hero-enter--cta mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5">
                <Button href="#project-inquiry" variant="light">
                  Discuss a Project
                </Button>
                <Button href="#services" variant="outline-light">
                  Explore Services
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hero-phase hero-phase--company"
          style={{
            opacity: reduceMotionStack ? 1 : p2,
            zIndex: p2 > p1 ? 4 : 2,
            visibility:
              reduceMotionStack || p2 >= 0.03 ? "visible" : "hidden",
            pointerEvents:
              reduceMotionStack || p2 >= 0.2 ? "auto" : "none",
          }}
          aria-labelledby="positioning-heading"
          aria-hidden={!reduceMotionStack && p2 < 0.15}
        >
          <div className="hero-phase__inner">
            <div className="hero-company w-full max-w-3xl">
              <p
                className="hero-story-item mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55"
                style={fullRevealStyle(revealEyebrow)}
              >
                Company
              </p>
              <h2
                id="positioning-heading"
                className="hero-story-item font-display text-balance text-[clamp(1.85rem,1.2rem+1.8vw,2.85rem)] font-bold leading-[1.12] tracking-tight text-white"
                style={fullRevealStyle(revealHeading)}
              >
                <span className="block">AI infrastructure requirements,</span>
                <span className="block">turned into delivery.</span>
              </h2>
              <p
                className="hero-story-item mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-white/65 sm:text-base"
                style={fullRevealStyle(revealSupport)}
              >
                Auramind is a Malaysia-based AI infrastructure delivery partner
                serving Southeast Asia—helping enterprises and project
                stakeholders move from intent to structured workstreams.
              </p>

              <div className="mt-8 grid gap-6 border-t border-white/14 pt-7 sm:grid-cols-3 sm:gap-7">
                {pillars.map((pillar, index) => (
                  <article
                    key={pillar.title}
                    className="hero-story-item relative pl-4"
                    style={fullRevealStyle(revealPillars[index] ?? 1)}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1.5 h-6 w-1 rounded-full bg-auramind-yellow"
                    />
                    <h3 className="text-base font-semibold tracking-tight text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {pillar.copy}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
