"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Hero } from "@/components/sections/Hero";

type HeroZoomSequenceProps = {
  next: ReactNode;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * 0.00–0.28  Phase 1 full
 * 0.28–0.42  Phase 1 out
 * 0.36–0.50  Phase 2 in
 * 0.50–0.88  Phase 2 full / stable (readable hold)
 * 0.88–1.00  Soft settle, then sticky releases into Regional
 *
 * Phase 2 stays fully opaque through most of the hold — no early blank gap.
 */
function phasesFromProgress(progress: number) {
  const phase1 = 1 - smoothstep(0.28, 0.42, progress);
  const phase2In = smoothstep(0.36, 0.5, progress);
  // Keep Phase 2 fully readable until the pin is nearly done.
  const phase2 = phase2In;
  return { phase1, phase2 };
}

export function HeroZoomSequence({ next }: HeroZoomSequenceProps) {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(reduced.matches);
    sync();
    reduced.addEventListener("change", sync);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.style.setProperty("--hero-progress", "0");
      document.documentElement.style.setProperty("--hero-phase1", "1");
      document.documentElement.style.setProperty("--hero-phase2", "1");
      document.documentElement.dataset.heroPin = "off";
      return () => {
        document.documentElement.style.removeProperty("--hero-progress");
        document.documentElement.style.removeProperty("--hero-phase1");
        document.documentElement.style.removeProperty("--hero-phase2");
        delete document.documentElement.dataset.heroPin;
      };
    }

    const node = sequenceRef.current;
    if (!node) return;

    const update = () => {
      frameRef.current = null;
      const total = node.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        document.documentElement.style.setProperty("--hero-progress", "0");
        document.documentElement.style.setProperty("--hero-phase1", "1");
        document.documentElement.style.setProperty("--hero-phase2", "0");
        document.documentElement.dataset.heroPin = "active";
        return;
      }

      const raw = clamp01(-node.getBoundingClientRect().top / total);
      const { phase1, phase2 } = phasesFromProgress(raw);
      setProgress(raw);

      document.documentElement.style.setProperty(
        "--hero-progress",
        raw.toFixed(4),
      );
      document.documentElement.style.setProperty(
        "--hero-phase1",
        phase1.toFixed(4),
      );
      document.documentElement.style.setProperty(
        "--hero-phase2",
        phase2.toFixed(4),
      );
      document.documentElement.dataset.heroPin =
        raw < 0.99 ? "active" : "released";
    };

    const onScroll = () => {
      if (frameRef.current != null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current != null) window.cancelAnimationFrame(frameRef.current);
      document.documentElement.style.removeProperty("--hero-progress");
      document.documentElement.style.removeProperty("--hero-phase1");
      document.documentElement.style.removeProperty("--hero-phase2");
      delete document.documentElement.dataset.heroPin;
    };
  }, [reduceMotion]);

  const { phase1, phase2 } = reduceMotion
    ? { phase1: 1, phase2: 1 }
    : phasesFromProgress(progress);

  return (
    <>
      <section
        ref={sequenceRef}
        className={`hero-narrative ${reduceMotion ? "is-reduced" : ""}`}
        aria-label="Introduction narrative"
        style={
          {
            "--hero-progress": progress,
            "--hero-phase1": phase1,
            "--hero-phase2": phase2,
          } as CSSProperties
        }
      >
        <div
          id="about"
          className="hero-scroll-anchor hero-scroll-anchor--about"
        />
        <div className="hero-narrative__sticky">
          <Hero
            scrollProgress={reduceMotion ? 0 : progress}
            phase1={phase1}
            phase2={phase2}
            reduceMotionStack={reduceMotion}
          />
        </div>
      </section>
      {next}
    </>
  );
}
