import { circuitShape } from "./circuit-path";

type Props = {
  circuitKey: string;
  className?: string;
  label: string;
  color?: string;
};

/** Stylized circuit outline with sector colouring. Decorative approximation, not to scale. */
export function CircuitTrace({ circuitKey, className, label, color = "var(--color-apex-blue)" }: Props) {
  const { d, start } = circuitShape(circuitKey);
  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth={14} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" pathLength={100} strokeDasharray="34 66" />
      <path d={d} fill="none" stroke="var(--color-apex-orange)" strokeWidth={3} strokeLinejoin="round" pathLength={100} strokeDasharray="0 34 33 33" />
      <path d={d} fill="none" stroke="var(--color-chalk)" strokeWidth={3} strokeLinejoin="round" pathLength={100} strokeDasharray="0 67 33 0" />
      <g transform={`translate(${start.x} ${start.y}) rotate(${start.angle})`}>
        <rect x={-2} y={-10} width={4} height={20} fill="var(--color-chalk)" />
      </g>
    </svg>
  );
}
