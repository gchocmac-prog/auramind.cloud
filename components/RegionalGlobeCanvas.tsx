"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const RegionalGlobe = dynamic(() => import("@/components/RegionalGlobe"), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
});

function GlobePlaceholder() {
  return (
    <div
      className="regional-globe-loading regional-globe relative mx-auto aspect-square w-full"
      aria-label="Loading regional globe"
    >
      <div className="pointer-events-none absolute -inset-5 rounded-full border border-auramind-silver/45 sm:-inset-7" />
      <div className="pointer-events-none absolute -inset-10 rounded-full border border-auramind-black/15 sm:-inset-12" />
      <div className="h-full w-full animate-pulse rounded-full bg-[#2a2a2c]/75" />
    </div>
  );
}

/**
 * Defers the heavy globe + countries.geojson fetch until the Regional
 * section approaches the viewport.
 */
export function RegionalGlobeCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={rootRef} className="w-full">
      {shouldLoad ? <RegionalGlobe /> : <GlobePlaceholder />}
    </div>
  );
}
