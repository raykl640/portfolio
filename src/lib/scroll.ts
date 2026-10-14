import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Smooth inertial scrolling for mouse/trackpad. Touch keeps native scrolling. */
export function startSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  document.documentElement.style.scrollBehavior = "auto";
  lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.11 });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
}
