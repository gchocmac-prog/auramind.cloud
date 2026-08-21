import type { ReactNode } from "react";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  /** Quieter line under the main title when needed. */
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  description,
  align = "left",
  dark = false,
  titleClassName = "",
  descriptionClassName = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p
          className={`mb-3.5 text-xs font-semibold uppercase tracking-[0.18em] ${
            dark ? "text-auramind-silver" : "text-auramind-black/55"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={`font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] ${
          dark ? "text-auramind-white" : "text-auramind-black"
        } ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 text-base font-medium tracking-tight sm:text-lg ${
            dark ? "text-auramind-silver/90" : "text-auramind-black/55"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-auramind-silver" : "text-auramind-black/65"
          } ${descriptionClassName}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
