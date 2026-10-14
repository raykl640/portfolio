/** Deterministic torn-paper edge, drawn above a section in that section's colour. */
function tornPath(seed: number, width = 1200, height = 28, step = 14) {
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let d = `M0 ${height}`;
  for (let x = 0; x <= width; x += step) {
    const y = 4 + rand() * (height - 10) * (0.55 + 0.45 * Math.sin(x / 90 + seed));
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return `${d} L${width} ${height} Z`;
}

export function TornEdge({ color, seed = 1, className = "" }: { color: string; seed?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 28"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 h-4 w-full -translate-y-[calc(100%-1px)] sm:h-6 ${className}`}
    >
      <path d={tornPath(seed)} fill={color} />
    </svg>
  );
}
