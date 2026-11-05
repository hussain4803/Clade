import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Base>
);
export const ArrowLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </Base>
);
export const ArrowUp = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20V5M6 11l6-6 6 6" />
  </Base>
);
export const ArrowDown = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </Base>
);
export const ChevronLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Base>
);
export const ChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 5l7 7-7 7" />
  </Base>
);
export const MenuIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 7h18M3 12h12M3 17h18" />
  </Base>
);
export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);
export const SearchIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </Base>
);
export const CalendarIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Base>
);
export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);
export const PinIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Base>
);
export const FlagIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 21V4M5 4h12l-2 4 2 4H5" />
  </Base>
);
export const MailIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </Base>
);
export const PhoneIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
  </Base>
);
export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
);
export const AlertIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5l9.5 16.5h-19z" />
    <path d="M12 10v4.5M12 17.5v.01" />
  </Base>
);
export const InfoIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8v.01" />
  </Base>
);
export const BoltIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M13 3L5 13h6l-1 8 8-10h-6z" />
  </Base>
);
export const EngineIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 10h2V8h4V6h4v2h3l2 3h2v5h-2l-2 2h-8l-2-2H6v2H4z" />
  </Base>
);
export const WeightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9h12l2 11H4z" />
    <circle cx="12" cy="6" r="2.5" />
  </Base>
);
export const AeroIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 8c5 0 7-2 11-2s7 2 7 2M3 13c6 0 8-2 12-2s6 2 6 2M3 18c5 0 7-2 11-2s7 2 7 2" />
  </Base>
);
export const FuelIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 20V5a1 1 0 011-1h7a1 1 0 011 1v15M4 20h11M5 10h9M14 8l3 2v7a1.5 1.5 0 003 0V9l-3-3" />
  </Base>
);
export const TyreIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5" />
  </Base>
);
export const TrophyIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 4h10v5a5 5 0 01-10 0zM7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3M12 14v4M8 20h8" />
  </Base>
);
export const ExternalIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
  </Base>
);
export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
    <path d="M8 10.5V7.5a4 4 0 018 0v3" />
  </Base>
);

export const SPEC_ICONS = {
  engine: EngineIcon,
  weight: WeightIcon,
  aero: AeroIcon,
  fuel: FuelIcon,
  tyre: TyreIcon,
  clock: ClockIcon,
} as const;
