import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "on-dark"
  | "light"
  | "outline-light";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-auramind-black text-auramind-elevated hover:bg-auramind-black/88 focus-visible:outline-auramind-yellow",
  secondary:
    "bg-auramind-elevated/70 text-auramind-black border border-auramind-silver/70 hover:border-auramind-silver hover:bg-auramind-elevated focus-visible:outline-auramind-yellow",
  ghost:
    "bg-transparent text-auramind-black hover:text-auramind-black/70 focus-visible:outline-auramind-black",
  /* Yellow primary for dark CTA surfaces */
  "on-dark":
    "border border-auramind-yellow bg-auramind-yellow text-auramind-black hover:bg-[#f5dc4a] focus-visible:outline-auramind-yellow",
  light:
    "border border-[#fdfdfd] bg-[#fdfdfd] text-[#080808] shadow-[0_0_0_rgba(253,253,253,0)] hover:shadow-[0_0_28px_rgba(253,253,253,0.32)] focus-visible:outline-white",
  "outline-light":
    "border border-white/55 bg-transparent text-[#fdfdfd] hover:border-white/70 hover:bg-white/[0.08] focus-visible:outline-white",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] px-6 py-3 text-sm font-semibold tracking-wide transition-[colors,box-shadow,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
