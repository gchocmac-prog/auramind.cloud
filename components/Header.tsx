"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#how-we-work", label: "How We Work" },
  { href: "#about", label: "About" },
  { href: "#project-inquiry", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const update = () => {
      const narrative = document.querySelector(".hero-narrative");
      const hero = document.getElementById("top");
      const nav =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height",
          ),
        ) || 72;

      if (
        narrative instanceof HTMLElement &&
        !narrative.classList.contains("is-reduced")
      ) {
        // Dark nav for the entire pinned narrative; flip near release.
        const pin = document.documentElement.dataset.heroPin;
        if (pin === "released") {
          setOverHero(false);
          return;
        }
        const pinEnd = Math.max(
          narrative.offsetHeight - window.innerHeight * 0.12,
          120,
        );
        setOverHero(window.scrollY < pinEnd);
        return;
      }

      const threshold = hero ? Math.max(hero.offsetHeight - nav, 120) : 480;
      setOverHero(window.scrollY < threshold);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onDark = overHero && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ${
        onDark
          ? "border-b border-transparent bg-transparent"
          : open
            ? "border-b border-auramind-black/8 bg-auramind-elevated"
            : "border-b border-auramind-black/8 bg-auramind-elevated/92 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[var(--container)] items-center justify-between gap-6 px-5 sm:h-[4.5rem] sm:px-8 lg:px-10">
        <Link
          href="#top"
          className={`relative z-[61] flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${
            onDark
              ? "focus-visible:outline-white"
              : "focus-visible:outline-auramind-black"
          }`}
          onClick={() => setOpen(false)}
        >
          <Logo variant={onDark ? "white" : "black"} size={36} priority />
          <span
            className={`text-sm font-semibold tracking-[0.04em] sm:text-base ${
              onDark ? "text-white" : "text-auramind-black"
            }`}
          >
            Auramind
          </span>
        </Link>

        <div className="relative z-[61] hidden items-center gap-8 lg:flex">
          <nav aria-label="Primary" className="flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  onDark
                    ? "text-white/75 hover:text-white"
                    : "text-auramind-black/70 hover:text-auramind-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button
            href="#project-inquiry"
            variant={onDark ? "light" : "primary"}
            className="px-5 py-2.5"
          >
            Discuss a Project
          </Button>
        </div>

        <button
          type="button"
          className={`relative z-[61] inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
            onDark
              ? "border border-white/25 bg-white/5 text-white"
              : "border border-auramind-silver/70 bg-auramind-elevated/80 text-auramind-black"
          }`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          <span className="relative block h-3.5 w-4">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full transition-transform ${
                onDark ? "bg-white" : "bg-auramind-black"
              } ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[6px] h-0.5 w-full transition-opacity ${
                onDark ? "bg-white" : "bg-auramind-black"
              } ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-[12px] h-0.5 w-full transition-transform ${
                onDark ? "bg-white" : "bg-auramind-black"
              } ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-auramind-black/8 bg-auramind-elevated lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          aria-label="Mobile"
          className="mx-auto flex max-w-[var(--container)] flex-col gap-1 px-5 py-4 sm:px-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-auramind-black"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 px-3 pb-2">
            <Button href="#project-inquiry" variant="primary" className="w-full">
              Discuss a Project
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
