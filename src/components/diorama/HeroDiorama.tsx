import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import { StaticDiorama } from "./StaticDiorama";

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const whenIdle = (fn: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout: 1200 });
  else setTimeout(fn, 200);
};

/** Full-bleed paper-cut landscape. SVG paints first; the WebGL scene fades in over it. */
export function HeroDiorama({ progress }: { progress: MotionValue<number> }) {
  const holder = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !webglAvailable()) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;
    whenIdle(async () => {
      try {
        const { mountDiorama } = await import("./scene");
        if (cancelled) return;
        const handle = await mountDiorama(el, {
          getProgress: () => progress.get(),
          onReady: () => !cancelled && setReady(true),
          onFail: () => !cancelled && setReady(false),
        });
        if (cancelled) handle.destroy();
        else destroy = handle.destroy;
      } catch {
        /* keep the SVG */
      }
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [progress]);

  return (
    <div className="absolute inset-0" aria-hidden>
      <StaticDiorama className="absolute inset-0 h-full w-full" />
      <div
        ref={holder}
        className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
