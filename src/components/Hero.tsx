import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { links, profile } from "../data/content";
import { Stamp } from "./art/Stamp";
import { HeroDiorama } from "./diorama/HeroDiorama";

/** Each letter soaks in like ink on load, and thickens under the pointer. */
function InkWord({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span className="inline-block" aria-label={text} role="text">
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden className="ink-letter" style={{ "--i": i + offset } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // 0 → 1 while the sticky hero is scrolled through: the camera moves into the scene, the sun sets
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const nameY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-60%"]);
  const nameOpacity = useTransform(scrollYProgress, [0.15, 0.6], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 0.5], ["0%", "40%"]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      id="top"
      ref={section}
      className={`relative ${reduce ? "h-svh min-h-[640px]" : "h-[185svh] sm:h-[210svh]"}`}
    >
      <div className="sticky top-0 h-svh min-h-[600px] overflow-hidden">
        <HeroDiorama progress={scrollYProgress} />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 pt-20 sm:px-8">
          {/* Masthead */}
          <motion.div style={reduce ? undefined : { opacity: nameOpacity }}>
            <div className="flex items-center justify-between gap-4 pt-4 pb-2 text-[11px] font-semibold tracking-[0.18em] uppercase sm:text-xs">
              <span>{profile.location}</span>
              <span className="hidden sm:inline">The Portfolio of</span>
              <span>Vol. 2026</span>
            </div>
            <div className="rule-double" />
          </motion.div>

          <motion.h1
            style={reduce ? undefined : { y: nameY, opacity: nameOpacity }}
            className="display relative mt-6 text-[clamp(4rem,18vw,12.5rem)] leading-[0.8] font-semibold sm:mt-8"
          >
            <span className="block">
              <InkWord text="Ray" />
            </span>
            <span className="block pl-[3vw] text-rust italic sm:pl-[8vw]">
              <InkWord text="Lukorito" offset={3} />
            </span>
          </motion.h1>

          <motion.div
            style={reduce ? undefined : { opacity: nameOpacity }}
            className="absolute top-32 right-6 hidden w-36 -rotate-12 sm:block lg:right-8 lg:w-40"
          >
            <Stamp text="COMPUTER SCIENCE · STRATHMORE · CLASS OF '27 · " className="w-full" />
          </motion.div>

          {/* Caption card, like a cover line printed over the illustration */}
          <motion.div
            style={reduce ? undefined : { y: cardY, opacity: cardOpacity }}
            className="mt-auto mb-6 w-full max-w-md self-start border-2 border-ink bg-cream/95 p-5 shadow-[6px_6px_0_var(--color-ink)] sm:mb-10 sm:p-6"
          >
            <p className="display text-2xl leading-tight italic sm:text-3xl">{profile.tagline}</p>
            <p className="mt-3 hidden leading-relaxed text-ink-soft sm:block">{profile.intro}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn bg-mustard text-sm" data-cursor="Scroll">
                See the work ↓
              </a>
              <a href={links.github} target="_blank" rel="noreferrer" className="btn bg-cream text-sm" data-cursor="Open">
                GitHub ↗
              </a>
            </div>
          </motion.div>

          <motion.p
            style={reduce ? undefined : { opacity: hintOpacity }}
            className="font-hand pointer-events-none absolute right-6 bottom-8 hidden rotate-[-4deg] text-2xl text-cream sm:block"
          >
            scroll into the sunset ↓
          </motion.p>
        </div>
      </div>
    </section>
  );
}
