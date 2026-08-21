"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { Color, MeshPhongMaterial } from "three";

type CountryFeature = {
  type: string;
  properties: {
    name: string;
    name_long?: string;
    admin?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

const SEA_COUNTRY_NAMES = new Set([
  "Malaysia",
  "Singapore",
  "Indonesia",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Brunei",
  "Cambodia",
  "Laos",
  "Lao PDR",
  "Myanmar",
  "Timor-Leste",
]);

const SEA_POINT_OF_VIEW = { lat: 4.2, lng: 113.5, altitude: 1.72 };

const MALAYSIA_ORIGIN = { lat: 3.14, lng: 101.69, name: "Malaysia" };

/** Abstract regional nodes — not offices, clients, or project sites. */
const REGIONAL_NODES = [
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Hanoi", lat: 21.0285, lng: 105.8542 },
];

const CONNECTION_ARCS = [
  {
    startLat: MALAYSIA_ORIGIN.lat,
    startLng: MALAYSIA_ORIGIN.lng,
    endLat: 13.7563,
    endLng: 100.5018,
  },
  {
    startLat: MALAYSIA_ORIGIN.lat,
    startLng: MALAYSIA_ORIGIN.lng,
    endLat: -6.2088,
    endLng: 106.8456,
  },
  {
    startLat: MALAYSIA_ORIGIN.lat,
    startLng: MALAYSIA_ORIGIN.lng,
    endLat: 14.5995,
    endLng: 120.9842,
  },
];

function countryName(feature: CountryFeature) {
  return feature.properties.name;
}

function isSoutheastAsia(feature: CountryFeature) {
  const { name, name_long, admin } = feature.properties;
  return (
    SEA_COUNTRY_NAMES.has(name) ||
    (name_long != null && SEA_COUNTRY_NAMES.has(name_long)) ||
    (admin != null && SEA_COUNTRY_NAMES.has(admin))
  );
}

function isMalaysia(feature: CountryFeature) {
  return countryName(feature) === "Malaysia";
}

export function RegionalGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const resumeTimerRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);
  /** Set by onGlobeReady — never triggers React state from that callback. */
  const globeEngineReadyRef = useRef(false);
  const didSetViewRef = useRef(false);

  const [dimensions, setDimensions] = useState({ width: 480, height: 480 });
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [ready, setReady] = useState(false);

  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: new Color("#1c1c1e"),
        emissive: new Color("#0e0e10"),
        emissiveIntensity: 0.18,
        shininess: 10,
        specular: new Color("#2e2e32"),
      }),
    [],
  );

  const pointsData = useMemo(() => {
    const origin = [{ ...MALAYSIA_ORIGIN, kind: "origin" as const }];
    if (isCompact) {
      return [
        ...origin,
        { ...REGIONAL_NODES[0], kind: "node" as const },
        { ...REGIONAL_NODES[1], kind: "node" as const },
      ];
    }
    return [
      ...origin,
      ...REGIONAL_NODES.map((node) => ({ ...node, kind: "node" as const })),
    ];
  }, [isCompact]);

  const arcsData = useMemo(
    () => (isCompact ? CONNECTION_ARCS.slice(0, 2) : CONNECTION_ARCS),
    [isCompact],
  );

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 639px)");
    const syncReduced = () => setReduceMotion(reduced.matches);
    const syncCompact = () => setIsCompact(compact.matches);
    syncReduced();
    syncCompact();
    reduced.addEventListener("change", syncReduced);
    compact.addEventListener("change", syncCompact);
    return () => {
      reduced.removeEventListener("change", syncReduced);
      compact.removeEventListener("change", syncCompact);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadCountries() {
      try {
        const response = await fetch("/globe/countries.geojson", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load countries.geojson: ${response.status}`,
          );
        }

        const data = (await response.json()) as {
          features?: CountryFeature[];
        };

        if (active) {
          setCountries(data.features ?? []);
        }
      } catch (error) {
        if (
          active &&
          !(error instanceof DOMException && error.name === "AbortError")
        ) {
          console.error(error);
          setCountries([]);
        }
      }
    }

    void loadCountries();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frameId = 0;
    let active = true;

    const updateSize = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!active) return;
        const rect = element.getBoundingClientRect();
        const size = Math.max(
          260,
          Math.floor(Math.min(rect.width, rect.height || rect.width)),
        );
        setDimensions((prev) => {
          if (prev.width === size && prev.height === size) return prev;
          return { width: size, height: size };
        });
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseAutoRotate = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    clearResumeTimer();
    globe.controls().autoRotate = false;
  }, [clearResumeTimer]);

  const scheduleAutoRotate = useCallback(() => {
    const globe = globeRef.current;
    if (!globe || reduceMotionRef.current) return;
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      const controls = globeRef.current?.controls();
      if (controls) {
        controls.autoRotateSpeed = 0.26;
        controls.autoRotate = true;
      }
    }, 2400);
  }, [clearResumeTimer]);

  const applyRendererQuality = useCallback(
    (globe: GlobeMethods, width: number, height: number) => {
      const renderer = globe.renderer();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      renderer.sortObjects = true;
    },
    [],
  );

  const configureControls = useCallback(
    (globe: GlobeMethods, setView = true) => {
      const controls = globe.controls();
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.085;
      controls.autoRotate = !reduceMotionRef.current;
      controls.autoRotateSpeed = 0.26;
      controls.minDistance = 145;
      controls.maxDistance = 400;
      if (setView) globe.pointOfView(SEA_POINT_OF_VIEW, 0);
    },
    [],
  );

  /**
   * onGlobeReady may fire during the library's init path (before this
   * component has finished mounting). Only mark a ref here — never setState.
   */
  const onGlobeReady = useCallback(() => {
    globeEngineReadyRef.current = true;
  }, []);

  /** Promote engine-ready into React state from an effect — never from onGlobeReady. */
  useEffect(() => {
    let active = true;
    let frameId = 0;

    const tick = () => {
      if (!active) return;

      if (globeRef.current && globeEngineReadyRef.current) {
        setReady(true);
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !ready) return;

    applyRendererQuality(globe, dimensions.width, dimensions.height);
    configureControls(globe, !didSetViewRef.current);
    didSetViewRef.current = true;

    const controls = globe.controls();
    const onStart = () => pauseAutoRotate();
    const onEnd = () => scheduleAutoRotate();
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);

    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.autoRotate = false;
    };
  }, [
    applyRendererQuality,
    configureControls,
    dimensions.height,
    dimensions.width,
    pauseAutoRotate,
    ready,
    reduceMotion,
    scheduleAutoRotate,
  ]);

  useEffect(() => {
    return () => {
      clearResumeTimer();
      globeEngineReadyRef.current = false;
      didSetViewRef.current = false;
    };
  }, [clearResumeTimer]);

  return (
    <div
      ref={containerRef}
      className="regional-globe relative mx-auto aspect-square w-full"
      role="img"
      aria-label="Interactive globe highlighting Southeast Asian countries from a Malaysia origin"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 rounded-full border border-auramind-silver/45 sm:-inset-7"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 rounded-full border border-auramind-black/15 sm:-inset-12"
      />

      <div className="regional-globe__stage relative h-full w-full overflow-hidden rounded-full">
        {!ready && (
          <div className="absolute inset-0 animate-pulse rounded-full bg-[#1c1c1e]/85" />
        )}
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          animateIn={!reduceMotion}
          showGlobe
          showGraticules
          showAtmosphere
          atmosphereColor="#d8dbe0"
          atmosphereAltitude={0.1}
          globeMaterial={globeMaterial}
          globeCurvatureResolution={2.2}
          polygonsData={countries}
          polygonGeoJsonGeometry="geometry"
          polygonCapColor={(d) => {
            const feature = d as CountryFeature;
            if (isMalaysia(feature)) return "#ffe566";
            if (isSoutheastAsia(feature)) return "#f8e46a";
            return "rgba(72, 74, 78, 0.88)";
          }}
          polygonSideColor={(d) => {
            const feature = d as CountryFeature;
            if (isMalaysia(feature)) return "rgba(255, 229, 102, 0.4)";
            if (isSoutheastAsia(feature)) return "rgba(248, 228, 106, 0.26)";
            return "rgba(24, 24, 26, 0.9)";
          }}
          polygonStrokeColor={() => "rgba(196, 199, 205, 0.78)"}
          polygonAltitude={(d) => {
            const feature = d as CountryFeature;
            if (isMalaysia(feature)) return 0.02;
            if (isSoutheastAsia(feature)) return 0.012;
            return 0.0035;
          }}
          polygonCapCurvatureResolution={2.2}
          polygonsTransitionDuration={reduceMotion ? 0 : 500}
          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointLabel={() => ""}
          pointColor={(d) =>
            (d as { kind?: string }).kind === "origin"
              ? "#fff3a0"
              : "rgba(248, 228, 106, 0.85)"
          }
          pointAltitude={(d) =>
            (d as { kind?: string }).kind === "origin" ? 0.03 : 0.014
          }
          pointRadius={(d) =>
            (d as { kind?: string }).kind === "origin" ? 0.55 : 0.28
          }
          pointsMerge={false}
          arcsData={arcsData}
          arcColor={() => ["rgba(248,228,106,0.55)", "rgba(174,177,184,0.15)"]}
          arcAltitude={0.12}
          arcStroke={0.35}
          arcDashLength={0.55}
          arcDashGap={0.35}
          arcDashAnimateTime={reduceMotion ? 0 : 4200}
          onGlobeReady={onGlobeReady}
          onGlobeClick={() => {
            pauseAutoRotate();
            scheduleAutoRotate();
          }}
        />
      </div>
    </div>
  );
}

export default RegionalGlobe;
