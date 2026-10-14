import { LAYERS, acacia, ridgePoints, ridgeY } from "./landscape";

// Rough perspective projection matching the WebGL camera's resting framing
const D = 9.5;
const F = 1 / Math.tan((35 * Math.PI) / 360);
const ASPECT = 1.6;
const W = 320;
const H = 200;
const TARGET_Y = 0.35;
const CAM_Y = 0.9;

function project(x: number, y: number, z: number): [number, number] {
  const k = F / (D - z);
  // approximate the slight downward tilt by blending camera height and target
  const ref = TARGET_Y + (CAM_Y - TARGET_Y) * (z / D);
  return [W / 2 + ((x * k) / ASPECT) * (W / 2), H / 2 - (y - ref) * k * (H / 2)];
}

const path = (pts: [number, number][], z: number) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${project(x, y, z).map((n) => n.toFixed(1)).join(" ")}`).join(" ") + "Z";

/** Instant-paint SVG version of the diorama; also the fallback without WebGL. */
export function StaticDiorama({ className = "" }: { className?: string }) {
  const [sx, sy] = project(0.6, 0.6, -6.5);
  const sr = (1.9 * F) / (D + 6.5) * (H / 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="sd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.15" stopColor="#f2e7d0" />
          <stop offset="0.65" stopColor="#efbd84" />
        </linearGradient>
        <linearGradient id="sd-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c35e" />
          <stop offset="0.55" stopColor="#e39a3e" />
          <stop offset="1" stopColor="#c4643a" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sd-sky)" />
      <circle cx={sx} cy={sy} r={sr * 2.2} fill="#ffd696" opacity="0.25" />
      <circle cx={sx} cy={sy} r={sr} fill="url(#sd-sun)" />
      {LAYERS.map((l) => {
        const outline: [number, number][] = [[-16, -12], ...ridgePoints(l, 0.4), [16, -12]];
        const pieces = [
          path(outline, l.z),
          ...(l.trees ?? []).flatMap((t) => {
            const { trunk, canopy } = acacia(t.x, ridgeY(l, t.x), t.s);
            return [path(trunk, l.z), path(canopy, l.z)];
          }),
        ].join(" ");
        return (
          <g key={l.z}>
            {/* cheap stepped shadow (no blur filter — keeps first paint fast on phones) */}
            <path d={pieces} fill="#1f150f" opacity="0.1" transform="translate(0.9 -1.3)" />
            <path d={pieces} fill="#1f150f" opacity="0.14" transform="translate(0.45 -0.65)" />
            <path d={pieces} fill={l.color} />
          </g>
        );
      })}
    </svg>
  );
}
