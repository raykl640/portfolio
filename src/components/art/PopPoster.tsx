import { useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { PosterKind } from "../../data/content";
import { PosterSvg, usePosterLayers } from "./Posters";

const DEPTH = 50; // px between layers

/**
 * A poster whose layers sit at different depths, like a pop-up book.
 * Mouse/trackpad: tilts toward the pointer with a glare highlight.
 * Touch: tilts gently as it scrolls through the viewport.
 */
export function PopPoster({ kind, href, label, lean }: { kind: PosterKind; href: string; label: string; lean: number }) {
  const layers = usePosterLayers(kind);
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const [finePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 17 });
  const sy = useSpring(py, { stiffness: 160, damping: 17 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollTiltX = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const scrollTiltY = useTransform(scrollYProgress, [0, 1], [lean > 0 ? -8 : 8, lean > 0 ? 8 : -8]);
  const pointerTiltX = useTransform(sy, [-0.5, 0.5], [14, -14]);
  const pointerTiltY = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const glare = useTransform(
    [sx, sy],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgb(255 244 220 / 0.38), transparent 55%)`,
  );

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!finePointer || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  const tilt = reduce
    ? { rotate: lean }
    : {
        rotate: lean,
        rotateX: finePointer ? pointerTiltX : scrollTiltX,
        rotateY: finePointer ? pointerTiltY : scrollTiltY,
        transformStyle: "preserve-3d" as const,
      };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      data-cursor="Open repo"
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="group block w-full max-w-md [perspective:1100px]"
    >
      <motion.div style={tilt} className="relative">
        {/* Back layer carries the printed frame; outline keeps layers aligned to the same box */}
        <div className="relative outline-2 outline-ink [box-shadow:7px_7px_0_var(--color-ink)]">
          <PosterSvg>{layers[0]}</PosterSvg>
          {finePointer && !reduce && (
            <motion.div
              aria-hidden
              style={{ background: glare }}
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>
        {layers.slice(1).map((layer, i) => (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ transform: reduce ? undefined : `translateZ(${(i + 1) * DEPTH}px)` }}
          >
            <PosterSvg>{layer}</PosterSvg>
          </div>
        ))}
      </motion.div>
    </a>
  );
}
