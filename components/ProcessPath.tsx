"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

export type ProcessStep = {
  name: string;
  description: string;
  output: string;
};

type ProcessPathProps = {
  steps: ProcessStep[];
};

export function ProcessPath({ steps }: ProcessPathProps) {
  const total = steps.length;
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldFocusTab = useRef(false);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [panelKey, setPanelKey] = useState(0);

  const activeStep = steps[active] ?? steps[0];
  const activeNumber = String(active + 1).padStart(2, "0");

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldFocusTab.current) return;
    shouldFocusTab.current = false;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const tabId = isDesktop
      ? `process-tab-${active}`
      : `process-mobile-tab-${active}`;
    document.getElementById(tabId)?.focus();
  }, [active]);

  const selectStep = (index: number) => {
    if (index === active) return;
    setActive(index);
    setPanelKey((value) => value + 1);
  };

  const onRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next = active;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (active + 1) % total;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (active - 1 + total) % total;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = total - 1;
    } else {
      return;
    }

    event.preventDefault();
    shouldFocusTab.current = true;

    if (next === active) {
      shouldFocusTab.current = false;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const tabId = isDesktop
        ? `process-tab-${active}`
        : `process-mobile-tab-${active}`;
      document.getElementById(tabId)?.focus();
      return;
    }

    selectStep(next);
  };

  return (
    <div
      ref={rootRef}
      className={`process-path ${entered ? "is-entered" : ""}`}
    >
      <p id={labelId} className="sr-only">
        Delivery process stages. Select a step to view details. Use arrow keys
        to move between stages.
      </p>

      <div
        className="process-path__rail"
        role="tablist"
        aria-labelledby={labelId}
        onKeyDown={onRailKeyDown}
      >
        <div className="process-path__rail-track" aria-hidden="true">
          <span
            className="process-path__rail-progress"
            style={{ width: `${(active / Math.max(total - 1, 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const number = String(index + 1).padStart(2, "0");
          const isActive = index === active;

          return (
            <button
              key={step.name}
              type="button"
              role="tab"
              id={`process-tab-${index}`}
              aria-selected={isActive}
              aria-controls={`process-panel-${index}`}
              tabIndex={isActive ? 0 : -1}
              className={`process-path__step ${isActive ? "is-active" : ""}`}
              style={{ "--step-i": index } as CSSProperties}
              onClick={() => selectStep(index)}
            >
              <span className="process-path__step-marker" aria-hidden="true">
                <span className="process-path__step-dot" />
              </span>
              <span className="process-path__step-number">{number}</span>
              <span className="process-path__step-title">{step.name}</span>
            </button>
          );
        })}
      </div>

      <div
        className="process-path__panel"
        role="tabpanel"
        id={`process-panel-${active}`}
        aria-labelledby={`process-tab-${active}`}
        aria-live="polite"
      >
        <div key={panelKey} className="process-path__panel-body">
          <span className="process-path__panel-number">{activeNumber}</span>
          <h3 className="process-path__panel-title">{activeStep.name}</h3>
          <p className="process-path__panel-desc">{activeStep.description}</p>
          <div className="process-path__panel-output">
            <span className="process-path__panel-output-label">Output</span>
            <span className="process-path__panel-output-value">
              {activeStep.output}
            </span>
          </div>
        </div>
      </div>

      <div
        className="process-path__mobile"
        role="tablist"
        aria-labelledby={labelId}
        onKeyDown={onRailKeyDown}
      >
        <div className="process-path__mobile-line" aria-hidden="true" />
        {steps.map((step, index) => {
          const number = String(index + 1).padStart(2, "0");
          const isActive = index === active;

          return (
            <div
              key={step.name}
              className={`process-path__mobile-item ${isActive ? "is-active" : ""}`}
              style={{ "--step-i": index } as CSSProperties}
            >
              <button
                type="button"
                role="tab"
                id={`process-mobile-tab-${index}`}
                aria-selected={isActive}
                aria-controls={`process-mobile-panel-${index}`}
                aria-expanded={isActive}
                tabIndex={isActive ? 0 : -1}
                className="process-path__mobile-trigger"
                onClick={() => selectStep(index)}
              >
                <span className="process-path__mobile-marker" aria-hidden="true">
                  <span className="process-path__mobile-dot" />
                </span>
                <span className="process-path__mobile-number">{number}</span>
                <span className="process-path__mobile-title">{step.name}</span>
              </button>

              <div
                id={`process-mobile-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`process-mobile-tab-${index}`}
                hidden={!isActive}
                className="process-path__mobile-panel"
              >
                {isActive ? (
                  <div className="process-path__mobile-panel-inner">
                    <p className="process-path__mobile-desc">{step.description}</p>
                    <div className="process-path__mobile-output">
                      <span className="process-path__mobile-output-label">
                        Output
                      </span>
                      <span className="process-path__mobile-output-value">
                        {step.output}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
