import { certifications, education, experience, toolkit } from "../data/content";
import { motion, useReducedMotion } from "motion/react";
import { TornEdge } from "./art/TornEdge";
import { Reveal } from "./ui/Reveal";
import { RevealText } from "./ui/RevealText";

// Public-folder paths need the deploy base prefix (e.g. /portfolio/ on GitHub Pages)
const resolvePublic = (url: string) => (url.startsWith("/") ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url);

const ticketColors = ["bg-mustard", "bg-cream", "bg-rust-light", "bg-cream"];

function Entry({ period, title, sub, body }: { period: string; title: string; sub: string; body?: string }) {
  return (
    <li className="grid gap-1 border-t-2 border-dashed border-ink/30 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <p className="display text-lg text-rust italic">{period}</p>
      <div>
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-ink-soft">{sub}</p>
        {body && <p className="mt-3 leading-relaxed">{body}</p>}
      </div>
    </li>
  );
}

/** Rubber stamp that slams onto a ticket when it scrolls into view. */
function IssuedStamp({ year, delay }: { year: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { scale: 2.4, opacity: 0, rotate: -30 }}
      whileInView={{ scale: 1, opacity: 0.85, rotate: -14 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 520, damping: 22, delay }}
      className="pointer-events-none absolute right-4 bottom-4 rounded-md border-[3px] border-double border-wine px-2.5 py-1 text-center text-wine mix-blend-multiply"
    >
      <p className="text-[10px] leading-none font-bold tracking-[0.2em]">ISSUED</p>
      <p className="display text-lg leading-none font-bold italic">{year}</p>
    </motion.div>
  );
}

export function Record() {
  return (
    <section id="record" className="relative bg-paper py-20 sm:py-28">
      <TornEdge color="#e5d4b5" seed={11} />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="font-hand text-3xl text-rust">chapter three — the paperwork</p>
        <RevealText as="h2" className="display mt-1 text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] font-semibold">
          Experience <span className="text-rust italic">&</span> education
        </RevealText>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h3 className="display mb-2 text-3xl font-semibold italic">Experience</h3>
            <ul>
              {experience.map((x) => (
                <Entry key={x.org} period={x.period} title={x.role} sub={`${x.org} · ${x.place}`} body={x.summary} />
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="display mb-2 text-3xl font-semibold italic">Education</h3>
            <ul>
              {education.map((e) => (
                <Entry key={e.credential} period={e.period} title={e.credential} sub={e.school} />
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Certificates as ticket stubs */}
        <Reveal className="mt-20">
          <h3 className="display text-3xl font-semibold italic">Certificates</h3>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert, i) => (
              <li
                key={cert.name}
                className={`ticket ${ticketColors[i % ticketColors.length]} p-2 transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1`}
              >
                <div className="relative flex h-full flex-col border-2 border-dashed border-ink/50 px-6 pt-5 pb-14">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase">Certificate · {cert.year}</p>
                  <p className="display mt-3 text-2xl leading-tight font-semibold">{cert.name}</p>
                  <p className="mt-1 text-sm text-ink/75">{cert.issuer}</p>
                  {cert.url && (
                    <a
                      href={resolvePublic(cert.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto self-start pt-4 text-sm font-semibold underline decoration-2 underline-offset-4"
                    >
                      View certificate ↗
                    </a>
                  )}
                  <IssuedStamp year={cert.year} delay={0.15 + i * 0.12} />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Toolkit */}
        <Reveal className="mt-20">
          <div className="print bg-cream p-6 sm:p-10">
            <h3 className="display text-3xl font-semibold italic">Tools of the trade</h3>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {toolkit.map((g) => (
                <div key={g.title}>
                  <p className="font-hand text-2xl text-rust">{g.title}</p>
                  <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 lg:block lg:space-y-1">
                    {g.items.map((it) => (
                      <li key={it} className="display text-xl">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
