import type { Livery } from "@/content/car";

/**
 * Stylized side profile of the fictional AVR-26 endurance prototype.
 * Pure SVG with no hooks so it renders in Server Components and in the image generator.
 */

const BODY =
  "M106 312 L100 240 L110 214 C170 206 230 196 262 186 C300 166 380 160 430 170 C470 176 500 160 528 136 " +
  "C556 112 600 104 650 104 C700 104 736 118 762 142 C790 166 820 176 852 176 C890 158 960 152 1012 172 " +
  "C1060 190 1100 222 1128 254 L1150 292 L1166 320 L993 318 A76 76 0 1 0 867 316 L393 316 " +
  "A76 76 0 1 0 267 316 L106 312 Z";

const TOP_CONTOUR =
  "M110 214 C170 206 230 196 262 186 C300 166 380 160 430 170 C470 176 500 160 528 136 C556 112 600 104 650 104 " +
  "C700 104 736 118 762 142 C790 166 820 176 852 176 C890 158 960 152 1012 172 C1060 190 1100 222 1128 254";

const FIN = "M540 128 C440 112 320 102 214 100 L210 116 L236 200 L520 200 Z";
const ENDPLATE = "M84 88 L196 88 L216 124 L182 214 L106 214 L92 150 Z";
const WING = "M64 100 C112 84 196 86 232 102 L230 112 C184 104 118 106 66 114 Z";
const GLASS =
  "M548 140 C572 118 610 112 652 112 C694 112 722 124 744 146 L730 154 C690 141 612 139 556 151 Z";

type Props = {
  livery: Livery;
  idPrefix: string;
  className?: string;
  /** Adds CSS hooks for spinning wheels / pulsing lights (honours reduced motion via CSS). */
  animated?: boolean;
  title?: string;
  /** Render without the ground shadow (for compositions that draw their own). */
  noShadow?: boolean;
  /** Explicit font for numbers (the image generator has no access to web fonts). */
  numberFont?: string;
};

function Wheel({ cx, cy, livery, animated, idPrefix }: { cx: number; cy: number; livery: Livery; animated?: boolean; idPrefix: string }) {
  const spokes = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <g>
      <circle cx={cx} cy={cy} r={62} fill="#07080A" />
      <circle cx={cx} cy={cy} r={60} fill="none" stroke="#2A3038" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={46} fill={`url(#${idPrefix}-rim)`} />
      {/* brake glow visible through the spokes */}
      <path
        d={`M${cx - 30} ${cy + 22} A38 38 0 0 0 ${cx + 30} ${cy + 22}`}
        fill="none"
        stroke={livery.accent}
        strokeOpacity={0.55}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <g className={animated ? "avr-wheel-spin" : undefined} style={animated ? { transformOrigin: `${cx}px ${cy}px` } : undefined}>
        {spokes.map((deg) => (
          <rect
            key={deg}
            x={cx - 2.5}
            y={cy - 44}
            width={5}
            height={34}
            rx={2}
            fill="#3A424D"
            transform={`rotate(${deg} ${cx} ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r={42} fill="none" stroke="#5B6672" strokeWidth={2} strokeDasharray="10 16" />
      </g>
      <circle cx={cx} cy={cy} r={11} fill={livery.stripe} />
      <circle cx={cx} cy={cy} r={4} fill="#0B0D10" />
    </g>
  );
}

export function CarSvg({ livery, idPrefix, className, animated = false, title, noShadow = false, numberFont }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const fontProps = numberFont
    ? { fontFamily: numberFont }
    : { style: { fontFamily: "var(--font-display), 'Chakra Petch', sans-serif" } };
  const label = title ?? `Stylized illustration of the AVR-26 hypercar in ${livery.name} livery`;
  return (
    <svg viewBox="0 0 1200 400" className={className} role="img" aria-labelledby={id("title")} xmlns="http://www.w3.org/2000/svg">
      <title id={id("title")}>{label}</title>
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={livery.base} />
          <stop offset="0.62" stopColor={livery.base} />
          <stop offset="1" stopColor={livery.baseShade} />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2B4A66" />
          <stop offset="0.45" stopColor="#0A1520" />
          <stop offset="1" stopColor="#05080C" />
        </linearGradient>
        <radialGradient id={id("rim")} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#2E3640" />
          <stop offset="1" stopColor="#0E1115" />
        </radialGradient>
        <radialGradient id={id("shadow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.85" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("fin")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={livery.baseShade} />
          <stop offset="1" stopColor={livery.base} />
        </linearGradient>
        <filter id={id("glow")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id={id("clip")}>
          <path d={BODY} />
        </clipPath>
      </defs>

      {!noShadow && <ellipse cx={630} cy={338} rx={560} ry={20} fill={`url(#${id("shadow")})`} />}

      {/* rear wing assembly */}
      <path d="M232 186 C226 160 214 132 196 110" fill="none" stroke="#0B0D10" strokeWidth={9} strokeLinecap="round" />
      <path d={WING} fill="#0B0D10" />
      <path d={FIN} fill={`url(#${id("fin")})`} />
      <path d="M540 128 C440 112 320 102 214 100" fill="none" stroke={livery.stripe} strokeOpacity={0.7} strokeWidth={2} />
      <path d={ENDPLATE} fill={livery.baseShade} stroke="#000" strokeOpacity={0.4} />
      <path d="M100 100 L190 100 L196 112 L104 112 Z" fill={livery.stripe} opacity={0.9} />
      <text
        x={144}
        y={176}
        textAnchor="middle"
        fontSize={44}
        fontWeight={700}
        fill={livery.plate}
        {...fontProps}
      >
        {livery.number}
      </text>

      {/* main body */}
      <path d={BODY} fill={`url(#${id("body")})`} />

      {/* livery graphics clipped to the body */}
      <g clipPath={`url(#${id("clip")})`}>
        <polygon points="566,90 716,90 566,340 416,340" fill={livery.stripe} />
        <polygon points="736,90 760,90 610,340 586,340" fill={livery.accent} />
        <polygon points="1010,140 1060,140 960,340 910,340" fill={livery.stripe} opacity={0.85} />
        <rect x={80} y={282} width={1100} height={60} fill="#0B0D10" opacity={0.9} />
        <rect x={80} y={280} width={1100} height={3} fill={livery.accent} opacity={0.9} />
        {/* sidepod inlet */}
        <path d="M784 224 C814 220 838 228 856 242 L848 258 C826 251 804 249 784 251 Z" fill="#06080A" opacity={0.85} />
        {/* number roundel */}
        <rect x={412} y={196} width={108} height={72} rx={6} fill={livery.plate} />
        <text
          x={466}
          y={250}
          textAnchor="middle"
          fontSize={54}
          fontWeight={700}
          fill={livery.numberColor}
          {...fontProps}
        >
          {livery.number}
        </text>
        {/* fender louvres */}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${900 + i * 18} 166 L${912 + i * 18} 186`} stroke="#000" strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
        ))}
        {/* door shut lines */}
        <path d="M556 158 L590 280 M748 156 L742 280" stroke="#000" strokeOpacity={0.35} strokeWidth={2} fill="none" />
      </g>

      {/* canopy */}
      <path d={GLASS} fill={`url(#${id("glass")})`} />
      <path d="M566 136 C596 122 636 118 676 120" fill="none" stroke="#9FD8FF" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
      {/* mirror */}
      <path d="M758 150 L792 144 L798 158 L764 162 Z" fill={livery.baseShade} />

      {/* body highlight */}
      <path d={TOP_CONTOUR} fill="none" stroke="#FFFFFF" strokeOpacity={0.22} strokeWidth={2} />

      {/* splitter and floor */}
      <path d="M993 318 L1170 322 L1170 326 L990 324 Z" fill="#050607" />
      <path d="M106 312 L267 316 L267 322 L104 318 Z" fill="#050607" />

      {/* lights */}
      <g className={animated ? "avr-light-pulse" : undefined}>
        <path d="M1066 198 L1124 238 L1116 246 L1058 208 Z" fill={livery.glow} filter={`url(#${id("glow")})`} opacity={0.9} />
        <path d="M1066 198 L1124 238 L1116 246 L1058 208 Z" fill="#FFFFFF" />
        <rect x={98} y={220} width={10} height={44} rx={2} fill="#FF3B1F" filter={`url(#${id("glow")})`} />
        <rect x={100} y={222} width={6} height={40} rx={2} fill="#FF6B4A" />
      </g>

      <Wheel cx={330} cy={274} livery={livery} animated={animated} idPrefix={idPrefix} />
      <Wheel cx={930} cy={274} livery={livery} animated={animated} idPrefix={idPrefix} />
    </svg>
  );
}
