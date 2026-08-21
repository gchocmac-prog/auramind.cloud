import Image from "next/image";

type LogoVariant = "black" | "white";

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
  size?: number;
};

const LOGO_SRC: Record<LogoVariant, string> = {
  black: "/logo/auramind-logo-black.png",
  white: "/logo/auramind-logo-white.png",
};

export function Logo({
  variant = "black",
  className = "",
  priority = false,
  size = 40,
}: LogoProps) {
  return (
    <Image
      src={LOGO_SRC[variant]}
      alt="Auramind"
      width={size}
      height={size}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
