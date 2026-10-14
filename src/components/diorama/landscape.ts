// Shared description of the paper-cut landscape, used by both the WebGL scene
// and the static SVG fallback so they look the same.

export type HillLayer = {
  z: number; // depth (camera looks down −z)
  color: string;
  base: number; // average ridge height
  amp: number;
  freq: number;
  seed: number;
  trees?: { x: number; s: number }[]; // acacia trees standing on this ridge
};

export const HALF_WIDTH = 16;

// Back (pale, distant) → front (dark, near): classic layered paper-cut sunset
export const LAYERS: HillLayer[] = [
  { z: -4.2, color: "#e2b25c", base: -0.15, amp: 0.5, freq: 0.32, seed: 1 },
  { z: -3.0, color: "#d9a034", base: -0.55, amp: 0.55, freq: 0.42, seed: 2, trees: [{ x: -4.6, s: 0.55 }] },
  { z: -1.8, color: "#c4643a", base: -1.0, amp: 0.55, freq: 0.5, seed: 3, trees: [{ x: 3.1, s: 0.75 }] },
  { z: -0.6, color: "#a8461f", base: -1.45, amp: 0.5, freq: 0.58, seed: 4, trees: [{ x: -2.4, s: 0.9 }, { x: 5.6, s: 0.8 }] },
  { z: 0.6, color: "#6e3437", base: -1.9, amp: 0.45, freq: 0.66, seed: 5, trees: [{ x: 0.9, s: 1.1 }] },
  { z: 1.8, color: "#3b5e54", base: -2.35, amp: 0.4, freq: 0.75, seed: 6, trees: [{ x: -3.9, s: 1.2 }] },
  { z: 3.0, color: "#2f4c44", base: -2.8, amp: 0.35, freq: 0.85, seed: 7 },
];

export function ridgeY(l: HillLayer, x: number) {
  const s = l.seed;
  return (
    l.base +
    l.amp *
      (0.6 * Math.sin(x * l.freq + s * 1.7) +
        0.3 * Math.sin(x * l.freq * 2.3 + s * 3.1) +
        0.1 * Math.sin(x * l.freq * 5.1 + s * 0.7))
  );
}

/** Ridge outline as [x, y] points from left to right. */
export function ridgePoints(l: HillLayer, step = 0.25) {
  const pts: [number, number][] = [];
  for (let x = -HALF_WIDTH; x <= HALF_WIDTH + 1e-6; x += step) pts.push([x, ridgeY(l, x)]);
  return pts;
}

/** Flat-topped acacia: thin forked trunk + wide umbrella canopy. Returns polygon outlines. */
export function acacia(x: number, groundY: number, s: number) {
  const trunk: [number, number][] = [
    [x - 0.05 * s, groundY - 0.1],
    [x - 0.035 * s, groundY + 0.55 * s],
    [x - 0.32 * s, groundY + 0.95 * s],
    [x - 0.27 * s, groundY + 0.98 * s],
    [x, groundY + 0.68 * s],
    [x + 0.3 * s, groundY + 1.0 * s],
    [x + 0.35 * s, groundY + 0.97 * s],
    [x + 0.04 * s, groundY + 0.55 * s],
    [x + 0.06 * s, groundY - 0.1],
  ];
  const canopy: [number, number][] = [];
  const cy = groundY + 1.05 * s;
  for (let i = 0; i <= 24; i++) {
    const t = (i / 24) * Math.PI * 2;
    // flattened, slightly lumpy ellipse
    const r = 1 + 0.08 * Math.sin(t * 5);
    const px = Math.cos(t) * 0.95 * s * r;
    const py = Math.sin(t) * (t < Math.PI ? 0.24 : 0.1) * s * r;
    canopy.push([x + px, cy + py]);
  }
  return { trunk, canopy };
}
