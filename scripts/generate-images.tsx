/**
 * Generates every raster image used by the site (hero, circuits, news covers, driver
 * portraits, livery studio shots, social card) from code-drawn SVG artwork.
 *
 *   npm run images
 *
 * Output is committed under public/images so this only needs re-running after art changes.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { ARTICLES } from "../prisma/seed-data/articles";
import { DRIVERS } from "../prisma/seed-data/drivers";
import { seededRandom } from "../prisma/seed-data/rng";
import { CIRCUIT_KEYS } from "../prisma/seed-data/races";
import { CarSvg } from "../src/components/art/CarSvg";
import { circuitShape } from "../src/components/art/circuit-path";
import { HelmetArt } from "../src/components/art/HelmetArt";
import { LIVERIES, type Livery } from "../src/content/car";

const OUT = path.join(process.cwd(), "public", "images");
const FONT = "JetBrains Mono";
const BLUE = "#00A3FF";
const ORANGE = "#FF6B00";
const CARBON = "#0B0D10";
const GRAPHITE = "#14181D";
const WHITE = "#F5F7FA";
const portraitAccent = (h: { stripe: string; shell: string }) => (h.stripe === CARBON ? h.shell : h.stripe);

const livery = (id: string, number?: string): Livery => {
  const l = LIVERIES.find((x) => x.id === id)!;
  return number ? { ...l, number } : l;
};

async function write(file: string, el: ReactElement, width: number, height: number, quality = 78) {
  const svg = renderToStaticMarkup(el);
  const target = path.join(OUT, file);
  await mkdir(path.dirname(target), { recursive: true });
  await sharp(Buffer.from(svg), { density: 72 }).resize(width, height).webp({ quality, effort: 5 }).toFile(target);
  console.log("  ✓", file);
}

function Frame({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {children}
    </svg>
  );
}

function Grid({ w, h, step = 64, opacity = 0.05 }: { w: number; h: number; step?: number; opacity?: number }) {
  const lines: ReactElement[] = [];
  for (let x = 0; x <= w; x += step) lines.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={h} stroke={WHITE} strokeOpacity={opacity} />);
  for (let y = 0; y <= h; y += step) lines.push(<line key={`y${y}`} x1={0} y1={y} x2={w} y2={y} stroke={WHITE} strokeOpacity={opacity} />);
  return <g>{lines}</g>;
}

function Noise({ w, h, id, opacity = 0.18 }: { w: number; h: number; id: string; opacity?: number }) {
  return (
    <>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={w} height={h} filter={`url(#${id})`} opacity={opacity} />
    </>
  );
}

function Stripes({ x, y, color = ORANGE, count = 3, size = 40, gap = 26, height = 900, opacity = 1 }: { x: number; y: number; color?: string; count?: number; size?: number; gap?: number; height?: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const ox = x + i * (size + gap);
        return <polygon key={i} points={`${ox},${y} ${ox + size},${y} ${ox + size - height * 0.45},${y + height} ${ox - height * 0.45},${y + height}`} fill={color} />;
      })}
    </g>
  );
}

function Streaks({ w, y0, y1, seed, colors = [BLUE, WHITE, ORANGE] }: { w: number; y0: number; y1: number; seed: string; colors?: string[] }) {
  const rand = seededRandom(seed);
  return (
    <g filter="url(#blurSoft)">
      {Array.from({ length: 26 }, (_, i) => {
        const y = y0 + rand() * (y1 - y0);
        const x = rand() * w * 0.7 - 200;
        const len = 300 + rand() * 900;
        return (
          <rect key={i} x={x} y={y} width={len} height={1.5 + rand() * 3} fill={colors[i % colors.length]} opacity={0.15 + rand() * 0.45} rx={2} />
        );
      })}
    </g>
  );
}

const commonDefs = (
  <>
    <filter id="blurSoft" x="-20%" y="-200%" width="140%" height="500%">
      <feGaussianBlur stdDeviation="2.5" />
    </filter>
    <filter id="blurBig" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
    <filter id="blurMed" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </>
);

/* ---------- Hero backdrop ---------- */
function HeroBackdrop() {
  const w = 2400;
  const h = 1350;
  const rand = seededRandom("hero");
  const horizon = 720;
  return (
    <Frame w={w} h={h}>
      <defs>
        {commonDefs}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040507" />
          <stop offset="0.45" stopColor="#0A1724" />
          <stop offset="0.54" stopColor="#10283C" />
          <stop offset="0.56" stopColor="#0B0D10" />
          <stop offset="1" stopColor="#07080A" />
        </linearGradient>
        <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#11151A" />
          <stop offset="1" stopColor="#050607" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#sky)" />
      {/* floodlight glows */}
      <circle cx={600} cy={horizon - 40} r={260} fill={BLUE} opacity={0.12} filter="url(#blurBig)" />
      <circle cx={1750} cy={horizon - 60} r={300} fill={ORANGE} opacity={0.1} filter="url(#blurBig)" />
      {/* distant bokeh lights */}
      <g filter="url(#blurMed)">
        {Array.from({ length: 70 }, (_, i) => (
          <circle
            key={i}
            cx={rand() * w}
            cy={horizon - 120 + rand() * 120}
            r={4 + rand() * 16}
            fill={[WHITE, ORANGE, BLUE, "#FFD7A8"][i % 4]}
            opacity={0.15 + rand() * 0.45}
          />
        ))}
      </g>
      {/* grandstand silhouette */}
      <path d={`M0 ${horizon - 30} L380 ${horizon - 70} L380 ${horizon - 10} L900 ${horizon - 40} L1400 ${horizon - 20} L1400 ${horizon - 90} L2050 ${horizon - 60} L2400 ${horizon - 30} L2400 ${horizon + 20} L0 ${horizon + 20} Z`} fill="#06080B" />
      {/* track surface in perspective */}
      <polygon points={`1120,${horizon} 1280,${horizon} 2400,${h} 0,${h}`} fill="url(#asphalt)" />
      {/* kerbs */}
      {Array.from({ length: 18 }, (_, i) => {
        const t0 = i / 18;
        const t1 = (i + 0.5) / 18;
        const y0 = horizon + (h - horizon) * t0 * t0;
        const y1 = horizon + (h - horizon) * t1 * t1;
        const x0 = 1120 - 1120 * ((y0 - horizon) / (h - horizon));
        const x1 = 1120 - 1120 * ((y1 - horizon) / (h - horizon));
        return <polygon key={i} points={`${x0},${y0} ${x1},${y1} ${x1 - 60 * t1},${y1} ${x0 - 60 * t0},${y0}`} fill={i % 2 ? WHITE : ORANGE} opacity={0.55} />;
      })}
      {/* centre line dashes */}
      {Array.from({ length: 10 }, (_, i) => {
        const t = (i + 0.2) / 10;
        const y = horizon + (h - horizon) * t * t;
        const ww = 3 + 26 * t;
        const hh = 8 + 70 * t;
        return <rect key={i} x={1200 - ww / 2 + (y - horizon) * 0.02} y={y} width={ww} height={hh} fill={WHITE} opacity={0.18} />;
      })}
      {/* light trails */}
      <g filter="url(#blurSoft)">
        {[
          { c: BLUE, o: 0.9, y: 980, k: 0 },
          { c: WHITE, o: 0.6, y: 1010, k: 40 },
          { c: ORANGE, o: 0.8, y: 1060, k: -30 },
          { c: "#FF2A1A", o: 0.7, y: 1110, k: 20 },
          { c: BLUE, o: 0.5, y: 1170, k: -60 },
        ].map((t, i) => (
          <path key={i} d={`M-100 ${t.y + 200} C700 ${t.y + t.k} 1500 ${t.y - 160} 2500 ${t.y - 260}`} stroke={t.c} strokeOpacity={t.o} strokeWidth={4 + i} fill="none" />
        ))}
      </g>
      <g filter="url(#blurMed)" opacity={0.6}>
        <path d={`M-100 1180 C700 980 1500 820 2500 720`} stroke={BLUE} strokeWidth={30} fill="none" opacity={0.35} />
        <path d={`M-100 1260 C700 1080 1500 900 2500 800`} stroke={ORANGE} strokeWidth={24} fill="none" opacity={0.3} />
      </g>
      <Grid w={w} h={h} step={80} opacity={0.035} />
      <Noise w={w} h={h} id="n" opacity={0.12} />
    </Frame>
  );
}

/* ---------- Circuit artwork ---------- */
function CircuitArt({ k }: { k: string }) {
  const w = 1600;
  const h = 900;
  const isImsa = ["daytona-24", "sebring-12", "watkins-glen-6", "petit-le-mans"].includes(k);
  const accent = isImsa ? ORANGE : BLUE;
  const second = isImsa ? BLUE : ORANGE;
  const { d, start, corners } = circuitShape(k, 400, 260, 24);
  return (
    <Frame w={w} h={h}>
      <defs>
        {commonDefs}
        <radialGradient id="g" cx="0.65" cy="0.45" r="0.7">
          <stop offset="0" stopColor={isImsa ? "#2A1406" : "#06223A"} />
          <stop offset="1" stopColor={CARBON} />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill="url(#g)" />
      <Grid w={w} h={h} step={50} opacity={0.05} />
      <Stripes x={-120} y={0} color={second} count={3} size={34} gap={22} height={h} opacity={0.5} />
      <g transform="translate(470 120) scale(2.5)">
        <path d={d} fill="none" stroke={accent} strokeWidth={10} strokeLinejoin="round" opacity={0.35} filter="url(#blurMed)" />
        <path d={d} fill="none" stroke="#FFFFFF" strokeOpacity={0.08} strokeWidth={10} strokeLinejoin="round" />
        <path d={d} fill="none" stroke={accent} strokeWidth={3} strokeLinejoin="round" />
        {corners.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={2.2} fill={i % 3 === 0 ? second : WHITE} opacity={0.8} />
        ))}
        <g transform={`translate(${start.x} ${start.y}) rotate(${start.angle})`}>
          <rect x={-2} y={-9} width={4} height={18} fill={WHITE} />
        </g>
      </g>
      <Noise w={w} h={h} id="n" opacity={0.1} />
    </Frame>
  );
}

/* ---------- News covers ---------- */
type Sky = "night" | "dusk" | "sunset" | "flood";
const SKIES: Record<Sky, [string, string, string]> = {
  night: ["#05070A", "#0B1A2A", "#0B0D10"],
  dusk: ["#0B0D10", "#2A1C2E", "#4A2A1A"],
  sunset: ["#140B06", "#5A2A0C", "#1A0F08"],
  flood: ["#05070A", "#13263A", "#0B0D10"],
};

function CarCover({ slug, l, sky, extra }: { slug: string; l: Livery; sky: Sky; extra?: "rain" | "mountain" | "flood" }) {
  const w = 1600;
  const h = 900;
  const [a, b, c] = SKIES[sky];
  const carSvg = renderToStaticMarkup(<CarSvg livery={l} idPrefix={`car-${slug}`} numberFont={FONT} />)
    .replace("<svg ", '<svg x="160" y="300" width="1300" height="433" ');
  return (
    <Frame w={w} h={h}>
      <defs>
        {commonDefs}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.62" stopColor={b} />
          <stop offset="0.66" stopColor={c} />
          <stop offset="1" stopColor="#040506" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#sky)" />
      {extra === "mountain" && <path d="M700 590 L1050 300 L1110 340 L1160 310 L1520 590 Z" fill="#1E2A38" opacity={0.8} />}
      {extra === "mountain" && <path d="M1010 334 L1050 300 L1110 340 L1160 310 L1200 345 L1120 360 L1060 350 Z" fill={WHITE} opacity={0.7} />}
      {(extra === "flood" || sky === "flood") && (
        <g>
          <circle cx={300} cy={150} r={160} fill={WHITE} opacity={0.15} filter="url(#blurBig)" />
          <circle cx={1350} cy={130} r={180} fill={WHITE} opacity={0.12} filter="url(#blurBig)" />
          <polygon points="300,150 120,900 520,900" fill={WHITE} opacity={0.035} />
          <polygon points="1350,130 1150,900 1560,900" fill={WHITE} opacity={0.03} />
        </g>
      )}
      <circle cx={1300} cy={560} r={220} fill={l.glow} opacity={0.16} filter="url(#blurBig)" />
      <Stripes x={1380} y={0} color={ORANGE} count={2} size={26} gap={18} height={h} opacity={0.45} />
      <Streaks w={w} y0={420} y1={720} seed={slug} />
      <g dangerouslySetInnerHTML={{ __html: carSvg }} />
      {extra === "rain" && (
        <g opacity={0.35}>
          {Array.from({ length: 90 }, (_, i) => {
            const r = seededRandom(`${slug}-rain-${i}`);
            const x = r() * w;
            const y = r() * h;
            return <line key={i} x1={x} y1={y} x2={x - 18} y2={y + 60} stroke="#BFE6FF" strokeWidth={1.5} />;
          })}
        </g>
      )}
      <Noise w={w} h={h} id="n" opacity={0.1} />
    </Frame>
  );
}

function BlueprintCover({ slug }: { slug: string }) {
  const w = 1600;
  const h = 900;
  const rand = seededRandom(slug);
  return (
    <Frame w={w} h={h}>
      <defs>{commonDefs}</defs>
      <rect width={w} height={h} fill="#06121E" />
      <Grid w={w} h={h} step={20} opacity={0.04} />
      <Grid w={w} h={h} step={100} opacity={0.08} />
      {/* streamlines */}
      {Array.from({ length: 14 }, (_, i) => {
        const y = 230 + i * 22;
        const bump = 80 + rand() * 40;
        return <path key={i} d={`M0 ${y} C400 ${y} 520 ${y - bump} 800 ${y - bump - 10} S1200 ${y - 20} 1600 ${y + 20}`} fill="none" stroke={BLUE} strokeOpacity={0.25 + (i % 3) * 0.1} strokeWidth={1.5} />;
      })}
      <g transform="translate(200 300) scale(1)" opacity={0.95}>
        <path
          d="M106 312 L100 240 L110 214 C170 206 230 196 262 186 C300 166 380 160 430 170 C470 176 500 160 528 136 C556 112 600 104 650 104 C700 104 736 118 762 142 C790 166 820 176 852 176 C890 158 960 152 1012 172 C1060 190 1100 222 1128 254 L1150 292 L1166 320 L993 318 A76 76 0 1 0 867 316 L393 316 A76 76 0 1 0 267 316 L106 312 Z"
          fill="none"
          stroke={WHITE}
          strokeWidth={2}
        />
        <path d="M84 88 L196 88 L216 124 L182 214 L106 214 L92 150 Z" fill="none" stroke={WHITE} strokeWidth={1.5} />
        <circle cx={330} cy={274} r={62} fill="none" stroke={WHITE} strokeWidth={1.5} />
        <circle cx={930} cy={274} r={62} fill="none" stroke={WHITE} strokeWidth={1.5} />
        <circle cx={330} cy={274} r={44} fill="none" stroke={BLUE} strokeWidth={1} />
        <circle cx={930} cy={274} r={44} fill="none" stroke={BLUE} strokeWidth={1} />
        {/* dimension lines */}
        <path d="M330 380 L930 380 M330 370 L330 390 M930 370 L930 390" stroke={ORANGE} strokeWidth={2} />
        <path d="M100 430 L1166 430 M100 420 L100 440 M1166 420 L1166 440" stroke={ORANGE} strokeWidth={2} opacity={0.7} />
        <path d="M1240 104 L1240 336 M1230 104 L1250 104 M1230 336 L1250 336" stroke={ORANGE} strokeWidth={2} opacity={0.7} />
      </g>
      <Stripes x={-160} y={0} color={BLUE} count={2} size={20} gap={16} height={h} opacity={0.35} />
      <Noise w={w} h={h} id="n" opacity={0.08} />
    </Frame>
  );
}

function HelmetCover({ slug, driverSlug }: { slug: string; driverSlug: string }) {
  const w = 1600;
  const h = 900;
  const d = DRIVERS.find((x) => x.slug === driverSlug)!;
  const accent = portraitAccent(d.helmet);
  return (
    <Frame w={w} h={h}>
      <defs>
        {commonDefs}
        <radialGradient id="bg" cx="0.6" cy="0.5" r="0.75">
          <stop offset="0" stopColor="#1C232C" />
          <stop offset="1" stopColor={CARBON} />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill="url(#bg)" />
      <Grid w={w} h={h} step={60} opacity={0.04} />
      <text x={80} y={760} fontFamily={FONT} fontWeight={800} fontSize={620} fill="none" stroke={accent} strokeOpacity={0.35} strokeWidth={4}>
        {String(d.number).padStart(2, "0")}
      </text>
      <Stripes x={1150} y={0} color={accent} count={3} size={30} gap={20} height={h} opacity={0.5} />
      <circle cx={980} cy={440} r={260} fill={accent} opacity={0.18} filter="url(#blurBig)" />
      <g transform="translate(640 80) scale(1.9)">
        <HelmetArt colors={d.helmet} number={d.number} idPrefix={`h-${slug}`} />
      </g>
      <Noise w={w} h={h} id="n" opacity={0.08} />
    </Frame>
  );
}

function HelmetRowCover({ slug }: { slug: string }) {
  const w = 1600;
  const h = 900;
  const six = DRIVERS.slice(0, 6);
  return (
    <Frame w={w} h={h}>
      <defs>{commonDefs}</defs>
      <rect width={w} height={h} fill={GRAPHITE} />
      <Grid w={w} h={h} step={60} opacity={0.05} />
      <rect y={620} width={w} height={280} fill={CARBON} />
      <rect y={618} width={w} height={3} fill={ORANGE} />
      {six.map((d, i) => (
        <g key={d.slug} transform={`translate(${-20 + i * 255} ${300}) scale(0.78)`}>
          <HelmetArt colors={d.helmet} number={d.number} idPrefix={`hr-${slug}-${i}`} />
        </g>
      ))}
      <circle cx={800} cy={200} r={300} fill={BLUE} opacity={0.1} filter="url(#blurBig)" />
      <Noise w={w} h={h} id="n" opacity={0.08} />
    </Frame>
  );
}

function TelemetryCover({ slug, palette = "blue" }: { slug: string; palette?: "blue" | "orange" }) {
  const w = 1600;
  const h = 900;
  const rand = seededRandom(slug);
  const main = palette === "blue" ? BLUE : ORANGE;
  const alt = palette === "blue" ? ORANGE : BLUE;
  const trace = (amp: number, base: number, smooth: number) => {
    let y = base;
    let d = `M0 ${base}`;
    for (let x = 0; x <= w; x += 16) {
      y += (rand() - 0.5) * amp;
      y = base + (y - base) * smooth;
      d += ` L${x} ${y.toFixed(1)}`;
    }
    return d;
  };
  return (
    <Frame w={w} h={h}>
      <defs>{commonDefs}</defs>
      <rect width={w} height={h} fill="#080B0F" />
      <Grid w={w} h={h} step={40} opacity={0.05} />
      {[180, 360, 540, 720].map((y) => (
        <line key={y} x1={0} x2={w} y1={y} y2={y} stroke={WHITE} strokeOpacity={0.12} strokeDasharray="6 10" />
      ))}
      <path d={trace(120, 300, 0.9)} fill="none" stroke={main} strokeWidth={4} />
      <path d={trace(120, 300, 0.9)} fill="none" stroke={main} strokeWidth={14} opacity={0.25} filter="url(#blurMed)" />
      <path d={trace(80, 520, 0.85)} fill="none" stroke={alt} strokeWidth={3} />
      <path d={trace(50, 700, 0.8)} fill="none" stroke={WHITE} strokeOpacity={0.6} strokeWidth={2} />
      {Array.from({ length: 40 }, (_, i) => {
        const bh = 20 + rand() * 120;
        return <rect key={i} x={40 + i * 38} y={860 - bh} width={22} height={bh} fill={i % 5 === 0 ? alt : main} opacity={0.5} />;
      })}
      <Noise w={w} h={h} id="n" opacity={0.08} />
    </Frame>
  );
}

function GarageCover({ slug, tone = "mixed" }: { slug: string; tone?: "mixed" | "blue" }) {
  const w = 1600;
  const h = 900;
  const vx = 800;
  const vy = 380;
  const rand = seededRandom(slug);
  return (
    <Frame w={w} h={h}>
      <defs>{commonDefs}</defs>
      <rect width={w} height={h} fill="#07090C" />
      {/* floor lines converging */}
      {Array.from({ length: 21 }, (_, i) => {
        const x = -800 + i * 160;
        return <line key={i} x1={vx} y1={vy} x2={x} y2={h} stroke={WHITE} strokeOpacity={0.07} />;
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const t = (i + 1) / 10;
        const y = vy + (h - vy) * t * t;
        return <line key={i} x1={0} x2={w} y1={y} y2={y} stroke={WHITE} strokeOpacity={0.05} />;
      })}
      {/* ceiling light bars */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = (i + 1) / 8;
        const y = vy - (vy - 20) * t * t;
        const half = 60 + 700 * t * t;
        const c = tone === "blue" ? BLUE : i % 2 ? ORANGE : BLUE;
        return (
          <g key={i}>
            <rect x={vx - half} y={y} width={half * 2} height={3 + 10 * t} fill={c} opacity={0.6} filter="url(#blurSoft)" />
            <rect x={vx - half} y={y} width={half * 2} height={2 + 4 * t} fill={WHITE} opacity={0.7} />
          </g>
        );
      })}
      {/* wall panels */}
      <polygon points={`0,0 ${vx - 300},${vy - 140} ${vx - 300},${vy + 140} 0,${h}`} fill="#0E1217" />
      <polygon points={`${w},0 ${vx + 300},${vy - 140} ${vx + 300},${vy + 140} ${w},${h}`} fill="#0E1217" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={60 + i * 50} y={300 + rand() * 40} width={30} height={120 + rand() * 80} fill={i % 3 ? "#1A2028" : ORANGE} opacity={0.6} />
      ))}
      <circle cx={vx} cy={vy + 120} r={240} fill={tone === "blue" ? BLUE : ORANGE} opacity={0.12} filter="url(#blurBig)" />
      <Noise w={w} h={h} id="n" opacity={0.1} />
    </Frame>
  );
}

function CratesCover({ slug }: { slug: string }) {
  const w = 1600;
  const h = 900;
  const rand = seededRandom(slug);
  const crates: ReactElement[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      if (rand() < 0.2 && row > 0) continue;
      const cw = 200;
      const ch = 140;
      const x = 120 + col * (cw + 10) + (row % 2) * 40;
      const y = 700 - row * (ch + 10);
      crates.push(
        <g key={`${row}-${col}`}>
          <rect x={x} y={y} width={cw} height={ch} fill="#1A1F26" stroke="#2D3540" strokeWidth={3} />
          <rect x={x} y={y + 20} width={cw} height={10} fill={(row + col) % 3 === 0 ? ORANGE : BLUE} opacity={0.8} />
          <text x={x + 16} y={y + ch - 20} fontFamily={FONT} fontWeight={700} fontSize={22} fill={WHITE} opacity={0.5}>
            {`AVR-${String(row * 7 + col + 1).padStart(3, "0")}`}
          </text>
        </g>,
      );
    }
  }
  return (
    <Frame w={w} h={h}>
      <defs>{commonDefs}</defs>
      <rect width={w} height={h} fill="#090B0E" />
      <Grid w={w} h={h} step={60} opacity={0.04} />
      {crates}
      <rect y={842} width={w} height={58} fill="#050607" />
      <Stripes x={-200} y={0} color={ORANGE} count={2} size={30} gap={20} height={h} opacity={0.4} />
      <Noise w={w} h={h} id="n" opacity={0.1} />
    </Frame>
  );
}

function BrakeCover({ slug }: { slug: string }) {
  const w = 1600;
  const h = 900;
  const cx = 880;
  const cy = 450;
  const rand = seededRandom(slug);
  return (
    <Frame w={w} h={h}>
      <defs>
        {commonDefs}
        <radialGradient id="disc" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.3" stopColor="#2A1008" />
          <stop offset="0.75" stopColor="#FF6B00" />
          <stop offset="0.9" stopColor="#FFB070" />
          <stop offset="1" stopColor="#3A1A08" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill="#07080A" />
      <Grid w={w} h={h} step={50} opacity={0.04} />
      <circle cx={cx} cy={cy} r={380} fill={ORANGE} opacity={0.2} filter="url(#blurBig)" />
      <circle cx={cx} cy={cy} r={330} fill="url(#disc)" />
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i / 72) * Math.PI * 2;
        const r = 200 + (i % 3) * 40 + rand() * 6;
        return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={7} fill="#140804" opacity={0.9} />;
      })}
      <circle cx={cx} cy={cy} r={150} fill="#111418" stroke="#2D3540" strokeWidth={6} />
      <circle cx={cx} cy={cy} r={40} fill={BLUE} />
      <path d={`M${cx + 240} ${cy - 250} L${cx + 380} ${cy - 120} L${cx + 380} ${cy + 120} L${cx + 240} ${cy + 250} L${cx + 300} ${cy} Z`} fill="#1A1F26" stroke="#2D3540" strokeWidth={4} />
      <Noise w={w} h={h} id="n" opacity={0.1} />
    </Frame>
  );
}

function SimCover() {
  const w = 1600;
  const h = 900;
  const { d } = circuitShape("le-mans", 400, 260, 24);
  const screens = [
    { x: 120, y: 220, skew: 12 },
    { x: 560, y: 180, skew: 0 },
    { x: 1000, y: 220, skew: -12 },
  ];
  return (
    <Frame w={w} h={h}>
      <defs>{commonDefs}</defs>
      <rect width={w} height={h} fill="#05070A" />
      <circle cx={800} cy={420} r={420} fill={BLUE} opacity={0.14} filter="url(#blurBig)" />
      {screens.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) skewY(${s.skew})`}>
          <rect width={480} height={300} fill="#0A1B2B" stroke={BLUE} strokeOpacity={0.6} strokeWidth={4} />
          <g transform="translate(40 20)">
            <path d={d} fill="none" stroke={i === 1 ? ORANGE : BLUE} strokeWidth={3} />
          </g>
        </g>
      ))}
      <path d="M520 900 C560 700 1040 700 1080 900 Z" fill="#0F1318" />
      <circle cx={800} cy={760} r={90} fill="none" stroke="#2D3540" strokeWidth={22} />
      <Noise w={w} h={h} id="n" opacity={0.08} />
    </Frame>
  );
}

const COVERS: Record<string, () => ReactElement> = {
  "bahrain-8-hours-preview": () => <CarCover slug="bahrain" l={livery("notturna")} sky="flood" extra="flood" />,
  "driver-line-up-confirmed-2027": () => <HelmetRowCover slug="lineup" />,
  "petit-le-mans-victory": () => <CarCover slug="plm" l={livery("notturna")} sky="night" />,
  "fuji-6-hours-strategy-win": () => <CarCover slug="fuji" l={livery("notturna")} sky="dusk" extra="mountain" />,
  "packing-for-flyaway-rounds": () => <CratesCover slug="crates" />,
  "brakes-that-last-24-hours": () => <BrakeCover slug="brakes" />,
  "nadia-okonkwo-rookie-season": () => <HelmetCover slug="nadia" driverSlug="nadia-okonkwo" />,
  "mara-lindqvist-leading-the-night": () => <HelmetCover slug="mara" driverSlug="mara-lindqvist" />,
  "night-shift-le-mans-garage": () => <GarageCover slug="garage" />,
  "le-mans-2026-second-place": () => <CarCover slug="lemans" l={livery("notturna")} sky="dusk" />,
  "le-mans-aero-kit-explained": () => <BlueprintCover slug="aero" />,
  "inside-the-hybrid-system": () => <TelemetryCover slug="hybrid" />,
  "luca-ferrandi-simulator-laps": () => <SimCover />,
  "spa-first-hypercar-win": () => <CarCover slug="spa" l={livery("notturna", "81")} sky="night" extra="rain" />,
  "driver-change-rehearsal": () => <GarageCover slug="pitstop" tone="blue" />,
  "sebring-12-hours-report": () => <CarCover slug="sebring" l={livery("notturna", "81")} sky="sunset" />,
  "qatar-season-opener-podium": () => <CarCover slug="qatar" l={livery("notturna")} sky="flood" extra="flood" />,
  "technical-centre-opens": () => <TelemetryCover slug="facility" palette="orange" />,
};

/* ---------- Driver portraits ---------- */
function DriverPortrait({ slug }: { slug: string }) {
  const w = 800;
  const h = 1000;
  const d = DRIVERS.find((x) => x.slug === slug)!;
  const accent = portraitAccent(d.helmet);
  return (
    <Frame w={w} h={h}>
      <defs>
        {commonDefs}
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2029" />
          <stop offset="1" stopColor={CARBON} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#bg)" />
      <Grid w={w} h={h} step={50} opacity={0.05} />
      <text x={w / 2} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={520} fill="none" stroke={accent} strokeOpacity={0.4} strokeWidth={4}>
        {String(d.number).padStart(2, "0")}
      </text>
      <Stripes x={560} y={0} color={accent} count={3} size={28} gap={18} height={h} opacity={0.4} />
      <circle cx={w / 2} cy={560} r={260} fill={accent} opacity={0.2} filter="url(#blurBig)" />
      <g transform="translate(40 300) scale(1.75)">
        <HelmetArt colors={d.helmet} number={d.number} idPrefix={`p-${slug}`} />
      </g>
      <rect y={h - 8} width={w} height={8} fill={accent} />
      <Noise w={w} h={h} id="n" opacity={0.08} />
    </Frame>
  );
}

/* ---------- Livery studio shots ---------- */
function StudioShot({ l }: { l: Livery }) {
  const w = 1600;
  const h = 800;
  const car = renderToStaticMarkup(<CarSvg livery={l} idPrefix={`studio-${l.id}`} numberFont={FONT} noShadow />);
  const top = car.replace("<svg ", '<svg x="100" y="140" width="1400" height="467" ');
  const reflection = car.replace("<svg ", '<svg x="100" y="140" width="1400" height="467" ');
  return (
    <Frame w={w} h={h}>
      <defs>
        {commonDefs}
        <radialGradient id="spot" cx="0.5" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#26303B" />
          <stop offset="1" stopColor="#07080A" />
        </radialGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07080A" stopOpacity={0.55} />
          <stop offset="0.5" stopColor="#07080A" stopOpacity={1} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#spot)" />
      <ellipse cx={800} cy={540} rx={760} ry={60} fill={l.glow} opacity={0.12} filter="url(#blurBig)" />
      <g transform={`translate(0 ${2 * 540}) scale(1 -1)`} opacity={0.35}>
        <g dangerouslySetInnerHTML={{ __html: reflection }} />
      </g>
      <rect y={540} width={w} height={h - 540} fill="url(#fade)" />
      <g dangerouslySetInnerHTML={{ __html: top }} />
      <Noise w={w} h={h} id="n" opacity={0.06} />
    </Frame>
  );
}

/* ---------- Social card ---------- */
function OgCard() {
  const w = 1200;
  const h = 630;
  const car = renderToStaticMarkup(<CarSvg livery={livery("notturna")} idPrefix="og" numberFont={FONT} />).replace(
    "<svg ",
    '<svg x="330" y="250" width="900" height="300" ',
  );
  return (
    <Frame w={w} h={h}>
      <defs>
        {commonDefs}
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B1622" />
          <stop offset="1" stopColor={CARBON} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#bg)" />
      <Grid w={w} h={h} step={40} opacity={0.05} />
      <Stripes x={1000} y={0} color={ORANGE} count={3} size={24} gap={16} height={h} opacity={0.7} />
      <Streaks w={w} y0={380} y1={540} seed="og" />
      <g dangerouslySetInnerHTML={{ __html: car }} />
      <text x={64} y={130} fontFamily={FONT} fontWeight={800} fontSize={64} fill={WHITE}>APEX VELOCITA</text>
      <text x={64} y={200} fontFamily={FONT} fontWeight={800} fontSize={64} fill="none" stroke={BLUE} strokeWidth={2}>RACING</text>
      <text x={64} y={250} fontFamily={FONT} fontWeight={500} fontSize={24} fill="#9AA4AF">Engineered for the long night · fictional team</text>
      <rect x={64} y={270} width={120} height={4} fill={ORANGE} />
    </Frame>
  );
}

async function main() {
  console.log("Generating images into public/images …");
  await write("hero/night-track.webp", <HeroBackdrop />, 2400, 1350, 72);
  for (const k of CIRCUIT_KEYS) await write(`circuits/${k}.webp`, <CircuitArt k={k} />, 1600, 900);
  for (const a of ARTICLES) {
    const make = COVERS[a.slug];
    if (!make) throw new Error(`No cover artwork mapped for article ${a.slug}`);
    await write(`news/${a.slug}.webp`, make(), 1600, 900);
  }
  for (const d of DRIVERS) await write(`drivers/${d.slug}.webp`, <DriverPortrait slug={d.slug} />, 800, 1000, 80);
  for (const l of LIVERIES) await write(`cars/livery-${l.id}.webp`, <StudioShot l={l} />, 1600, 800, 82);
  // Social card as JPEG for broad compatibility.
  const og = renderToStaticMarkup(<OgCard />);
  await sharp(Buffer.from(og)).jpeg({ quality: 82 }).toFile(path.join(OUT, "og-card.jpg"));
  console.log("  ✓ og-card.jpg\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
