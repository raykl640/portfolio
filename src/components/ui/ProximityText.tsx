import { useEffect, useRef } from "react";

type Part = { text: string; italic?: boolean };

/**
 * Display text whose letters swell bolder as the pointer comes near — the variable
 * weight axis of Fraunces does the work, so it's cheap. Static on touch screens.
 */
export function ProximityText({ lines, className = "", radius = 260 }: { lines: Part[][]; className?: string; radius?: number }) {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-l]"));
    let frame = 0;
    let px = -1e4;
    let py = -1e4;
    let inView = false;
    const apply = () => {
      frame = 0;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
        const t = Math.max(0, 1 - d / radius);
        const e = t * t * (3 - 2 * t);
        l.style.fontWeight = String(Math.round(560 + 340 * e));
        l.style.transform = e > 0.01 ? `translateY(${(-e * 0.06).toFixed(3)}em) rotate(${(-e * 4).toFixed(2)}deg)` : "";
      }
    };
    const move = (e: PointerEvent) => {
      if (!inView) return;
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) {
        px = py = -1e4;
        apply();
      }
    });
    io.observe(el);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, [radius]);

  const text = lines.map((ln) => ln.map((p) => p.text).join("")).join(" ");
  return (
    <h2 ref={root} className={className} aria-label={text}>
      {lines.map((ln, li) => (
        <span key={li} className="block" aria-hidden>
          {ln.map((part, pi) =>
            part.text.split(/(\s+)/).map((word, wi) =>
              /^\s+$/.test(word) ? (
                " "
              ) : (
                <span key={`${pi}-${wi}`} className={`inline-block whitespace-nowrap ${part.italic ? "italic" : ""}`}>
                  {[...word].map((ch, ci) => (
                    <span key={ci} data-l className="inline-block transition-[font-weight,transform] duration-200 ease-out">
                      {ch}
                    </span>
                  ))}
                </span>
              ),
            ),
          )}
        </span>
      ))}
    </h2>
  );
}
