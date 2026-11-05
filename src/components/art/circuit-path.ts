/**
 * Generates a stylized, clearly not-to-scale "track map" outline for a circuit key.
 * Deterministic: the same key always yields the same shape.
 */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type CircuitShape = { d: string; start: { x: number; y: number; angle: number }; corners: { x: number; y: number }[] };

export function circuitShape(key: string, width = 400, height = 260, padding = 24): CircuitShape {
  const rand = rng(hash(key));
  const n = 10 + Math.floor(rand() * 5);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + (rand() - 0.5) * 0.35;
    const radius = i % 3 === 1 ? 0.3 + rand() * 0.35 : 0.65 + rand() * 0.35;
    pts.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * (0.6 + rand() * 0.25) });
  }

  // Normalise into the viewbox.
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY));
  const offX = (width - (maxX - minX) * scale) / 2;
  const offY = (height - (maxY - minY) * scale) / 2;
  const P = pts.map((p) => ({ x: offX + (p.x - minX) * scale, y: offY + (p.y - minY) * scale }));

  // Rounded corners: straight segments joined by quadratic curves through each vertex.
  const cut = 0.24;
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });
  let d = "";
  for (let i = 0; i < P.length; i++) {
    const prev = P[(i - 1 + P.length) % P.length]!;
    const cur = P[i]!;
    const next = P[(i + 1) % P.length]!;
    const a = seg(cur, prev, cut);
    const b = seg(cur, next, cut);
    d += i === 0 ? `M${a.x.toFixed(1)} ${a.y.toFixed(1)} ` : `L${a.x.toFixed(1)} ${a.y.toFixed(1)} `;
    d += `Q${cur.x.toFixed(1)} ${cur.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)} `;
  }
  d += "Z";

  const p0 = P[0]!;
  const p1 = P[1]!;
  const mid = seg(p0, p1, 0.5);
  const angle = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;
  return { d, start: { x: mid.x, y: mid.y, angle }, corners: P };
}
