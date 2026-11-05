type HelmetColors = { shell: string; stripe: string; accent: string; visor: string };

/** Side-profile racing helmet illustration (pure SVG, used by the image generator). */
export function HelmetArt({ colors, number, idPrefix, numberFont = "JetBrains Mono" }: { colors: HelmetColors; number: number; idPrefix: string; numberFont?: string }) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const SHELL =
    "M84 232 C72 140 142 68 232 68 C312 68 354 128 356 190 L356 232 C356 272 334 302 302 314 L172 320 C122 320 90 292 84 232 Z";
  return (
    <g>
      <defs>
        <clipPath id={id("shell")}>
          <path d={SHELL} />
        </clipPath>
        <linearGradient id={id("visor")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7FC8FF" stopOpacity={0.7} />
          <stop offset="0.35" stopColor={colors.visor} />
          <stop offset="1" stopColor="#020304" />
        </linearGradient>
        <radialGradient id={id("sheen")} cx="0.35" cy="0.25" r="0.7">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={SHELL} fill={colors.shell} />
      <g clipPath={`url(#${id("shell")})`}>
        <path d="M40 214 C120 120 230 96 380 128 L380 162 C236 128 130 150 40 250 Z" fill={colors.stripe} />
        <path d="M40 262 C130 166 236 146 380 176 L380 186 C236 158 130 178 40 274 Z" fill={colors.accent} />
        <rect x={40} y={292} width={340} height={40} fill="#0B0D10" opacity={0.85} />
        <path d={SHELL} fill={`url(#${id("sheen")})`} />
      </g>
      {/* visor */}
      <path d="M236 150 C282 138 334 146 358 170 L358 216 C322 216 272 216 238 208 C222 192 222 164 236 150 Z" fill={`url(#${id("visor")})`} />
      <path d="M244 160 C280 152 318 156 344 170" fill="none" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={4} strokeLinecap="round" />
      {/* visor pivot */}
      <circle cx={226} cy={190} r={11} fill="#0B0D10" />
      <circle cx={226} cy={190} r={5} fill={colors.stripe} />
      {/* chin bar vent */}
      <path d="M312 238 L350 238 M316 252 L346 252 M322 266 L340 266" stroke="#0B0D10" strokeWidth={5} strokeLinecap="round" />
      {/* rear spoiler */}
      <path d="M104 132 L150 98 L164 112 L118 146 Z" fill="#0B0D10" opacity={0.9} />
      <text x={150} y={262} fontFamily={numberFont} fontWeight={800} fontSize={54} fill={colors.accent === "#0B0D10" ? "#0B0D10" : "#F5F7FA"} opacity={0.95}>
        {String(number).padStart(2, "0")}
      </text>
    </g>
  );
}
