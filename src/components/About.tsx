import { profile } from "../data/content";
import { TornEdge } from "./art/TornEdge";
import { Reveal } from "./ui/Reveal";

export function About() {
  return (
    <section id="about" className="relative bg-pine py-20 text-cream sm:py-28">
      <TornEdge color="#3b5e54" seed={7} />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="halftone absolute -top-24 -left-24 size-[28rem] rounded-full text-pine-deep" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="font-hand text-3xl text-mustard">chapter two — about me</p>
          <blockquote className="display mt-6 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.05] font-medium italic">
            <span aria-hidden className="block h-[0.55em] text-[2.2em] leading-none text-mustard not-italic">
              “
            </span>
            {profile.quote}
          </blockquote>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:pt-14">
          <div className="space-y-5 text-lg leading-relaxed text-cream/85">
            {profile.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <dl className="mt-10 space-y-6 border-t-2 border-dashed border-cream/30 pt-8">
            <div>
              <dt className="font-hand text-2xl text-mustard">off the clock</dt>
              <dd className="mt-1 text-cream/85">{profile.offClock}</dd>
            </div>
            <div>
              <dt className="font-hand text-2xl text-mustard">languages</dt>
              <dd className="mt-1 text-cream/85">{profile.languages}</dd>
            </div>
          </dl>
        </Reveal>
      </div>

    </section>
  );
}
