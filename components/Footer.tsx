import Link from "next/link";
import { Logo } from "@/components/Logo";

const footerLinks = [
  { href: "#services", label: "Services" },
  { href: "#how-we-work", label: "How We Work" },
  { href: "#about", label: "About" },
  { href: "#project-inquiry", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-auramind-black/10 bg-auramind-secondary">
      <div className="mx-auto flex w-full max-w-[var(--container)] flex-col gap-10 px-5 py-12 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-10 lg:py-14">
        <div className="max-w-sm">
          <Link href="#top" className="inline-flex items-center gap-2.5">
            <Logo variant="black" size={32} />
            <span className="text-sm font-semibold tracking-[0.04em]">
              Auramind
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-auramind-black/60">
            Malaysia-based AI infrastructure delivery partner serving Southeast
            Asia.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-auramind-black/70 transition-colors hover:text-auramind-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-auramind-black/8">
        <div className="mx-auto flex w-full max-w-[var(--container)] flex-col gap-2 px-5 py-5 text-xs text-auramind-black/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© {new Date().getFullYear()} Auramind. All rights reserved.</p>
          <p>Execution-led · Vendor-neutral · Regionally connected</p>
        </div>
      </div>
    </footer>
  );
}
