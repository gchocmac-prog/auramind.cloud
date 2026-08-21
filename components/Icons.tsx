import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

function IconBase({ title, children, className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={`shrink-0 ${className}`}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconAssess(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.25" />
      <path d="M16.2 16.2 20 20" />
      <path d="M8.5 11h5M11 8.5v5" />
    </IconBase>
  );
}

export function IconDesign(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.5 16.5 14.2 6.8a2.1 2.1 0 0 1 3 3L7.5 19.5H4.5v-3Z" />
      <path d="M12.8 8.2l3 3" />
    </IconBase>
  );
}

export function IconDeliver(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8.5h11.5v9H4z" />
      <path d="M15.5 11.5H19l1.5 3v3h-5" />
      <circle cx="7.5" cy="18.5" r="1.4" />
      <circle cx="16.5" cy="18.5" r="1.4" />
    </IconBase>
  );
}

export function IconOperate(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.4 6.4l1.6 1.6M16 16l1.6 1.6M17.6 6.4 16 8M8 16l-1.6 1.6" />
    </IconBase>
  );
}

export function IconPin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s5.5-5.1 5.5-9.2A5.5 5.5 0 0 0 6.5 11.8C6.5 15.9 12 21 12 21Z" />
      <circle cx="12" cy="11.5" r="1.8" />
    </IconBase>
  );
}

export function IconNetwork(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M7.7 8.3 10.4 15M16.3 8.3 13.6 15M8 7h8" />
    </IconBase>
  );
}

export function IconPartners(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8" r="2.4" />
      <circle cx="16.2" cy="9.2" r="2" />
      <path d="M4.5 17.5c.4-2.4 2.2-3.8 4.5-3.8s4.1 1.4 4.5 3.8" />
      <path d="M13.2 17.5c.2-1.5 1.1-2.6 2.9-2.9" />
    </IconBase>
  );
}

export function IconPower(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4.5v6" />
      <path d="M8.2 8.2a5.5 5.5 0 1 0 7.6 0" />
    </IconBase>
  );
}

export function IconDoc(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 4.5h7.2L17.5 8v11.5H7z" />
      <path d="M14.2 4.5V8H17.5" />
      <path d="M9.5 12h5M9.5 15.5h5" />
    </IconBase>
  );
}
