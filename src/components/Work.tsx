import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { alsoBuilt, links, projects, type Project } from "../data/content";
import { PopPoster } from "./art/PopPoster";
import { TornEdge } from "./art/TornEdge";
import { RevealText } from "./ui/RevealText";
import { Reveal } from "./ui/Reveal";

const sheetColors = ["#f2e7d0", "#ead9b6", "#f0e1c4", "#e7d3ad"];

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 640px)");
    const update = () => setDesktop(mq.matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

function HandArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 50" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M76 8 C 52 4 22 14 8 40" />
      <path d="M6 26 L8 41 L22 36" />
    </svg>
  );
}

/** One project, printed on its own sheet. On desktop it pins and gets covered by the next. */
function Sheet({ p, i, n, progress, stacked }: { p: Project; i: number; n: number; progress: MotionValue<number>; stacked: boolean }) {
  const flip = i % 2 === 1;
  const start = i / n;
  const end = (i + 1) / n;
  const scale = useTransform(progress, [start, end], [1, i === n - 1 ? 1 : 0.93]);
  const shade = useTransform(progress, [start, end], [0, i === n - 1 ? 0 : 0.22]);

  return (
    <motion.article
      style={stacked ? { scale, top: 96 + i * 22 } : undefined}
      className={`relative origin-top border-2 border-ink shadow-[8px_8px_0_var(--color-ink)] lg:sticky ${
        stacked ? "lg:mb-[28vh] lg:h-[min(780px,calc(100svh-150px))]" : "mb-14 sm:mb-20"
      }`}
    >
      {/* Folder tab with the issue number */}
      <div
        className={`absolute -top-[34px] flex h-[34px] items-center gap-3 border-2 border-b-0 border-ink px-4 text-sm font-semibold ${
          flip ? "right-8" : "left-8"
        }`}
        style={{ background: sheetColors[i % sheetColors.length] }}
      >
        <span className="display text-rust italic">No. {String(i + 1).padStart(2, "0")}</span>
        <span className="hidden tracking-[0.14em] uppercase sm:inline">{p.title}</span>
      </div>

      <div
        className="relative grid h-full items-center gap-10 overflow-visible p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-12"
        style={{ background: sheetColors[i % sheetColors.length] }}
      >
        <div className={`relative lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
          <div className={`mx-auto w-[88%] max-w-[23rem] sm:w-full lg:mx-0 ${flip ? "lg:ml-auto" : ""}`}>
            <PopPoster kind={p.poster} href={p.repo} label={`${p.title} on GitHub`} lean={flip ? 2 : -2} />
          </div>
          {p.note && (
            <div className="pointer-events-none absolute -top-9 right-0 flex items-start gap-1 text-rust sm:-right-4 lg:-right-14">
              <HandArrow className="mt-5 w-12" />
              <span className="font-hand rotate-[6deg] text-2xl leading-none">{p.note}</span>
            </div>
          )}
        </div>

        <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <p className="display text-xl text-ink-soft italic">{p.year}</p>
          <h3 className="display mt-1 text-5xl leading-[0.95] font-semibold sm:text-6xl xl:text-7xl">{p.title}</h3>
          <p className="display mt-3 text-2xl text-rust italic">{p.subtitle}</p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{p.description}</p>
          <p className="mt-6 text-sm">
            <span className="font-semibold tracking-[0.14em] uppercase">Built with</span>
            <span className="ml-3 text-ink-soft">{p.stack.join(" · ")}</span>
          </p>
          <a href={p.repo} target="_blank" rel="noreferrer" className="btn mt-7 bg-cream text-sm" data-cursor="Open">
            Read the code ↗
          </a>
        </div>

        {stacked && (
          <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-ink" />
        )}
      </div>
    </motion.article>
  );
}

export function Work() {
  const list = useRef<HTMLDivElement>(null);
  const stacked = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: list, offset: ["start start", "end end"] });

  return (
    <section id="work" className="relative bg-paper-deep py-20 sm:py-28">
      <TornEdge color="#d9c29b" seed={3} />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="font-hand text-3xl text-rust">chapter one</p>
        <RevealText as="h2" className="display mt-1 text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.9] font-semibold">
          Selected <span className="italic">work</span>
        </RevealText>

        <div ref={list} className="mt-20 sm:mt-24">
          {projects.map((p, i) => (
            <Sheet key={p.title} p={p} i={i} n={projects.length} progress={scrollYProgress} stacked={stacked} />
          ))}
        </div>

        {/* Table-of-contents style list of smaller repos */}
        <Reveal className="mt-10 sm:mt-16">
          <div className="border-t-2 border-ink pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="display text-3xl font-semibold italic">Smaller things</h3>
              <a href={links.github} target="_blank" rel="noreferrer" className="squiggle font-medium" data-cursor="Open">
                Everything on GitHub ↗
              </a>
            </div>
            <ul className="mt-6 grid gap-x-16 md:grid-cols-2">
              {alsoBuilt.map((a) => (
                <li key={a.repo}>
                  <a href={a.repo} target="_blank" rel="noreferrer" className="group flex items-baseline gap-3 py-3" data-cursor="Open">
                    <span className="text-lg font-medium group-hover:text-rust">{a.title}</span>
                    <span className="mb-1.5 flex-1 border-b-2 border-dotted border-ink/40" aria-hidden />
                    <span className="text-sm text-ink-soft">{a.lang}</span>
                    <span className="transition-transform group-hover:translate-x-1">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
