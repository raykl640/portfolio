import { useState } from "react";
import { links, profile } from "../data/content";
import { StripedSun } from "./art/Posters";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { TornEdge } from "./art/TornEdge";
import { ProximityText } from "./ui/ProximityText";
import { Reveal } from "./ui/Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = links.email;
    }
  };

  return (
    <section id="contact" className="relative bg-rust text-cream">
      <TornEdge color="#a8461f" seed={19} />
      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-8 sm:pt-28">
        <Reveal>
          <p className="font-hand text-3xl text-mustard">the last chapter — write to me</p>
          <ProximityText
            className="display mt-2 text-[clamp(3.4rem,11vw,9rem)] leading-[0.88] font-semibold"
            lines={[[{ text: "Let's make" }], [{ text: "something " }, { text: "good.", italic: true }]]}
          />
          <p className="mt-8 max-w-lg text-lg text-cream/85">
            Internships, collaborations, or just to talk shop — my inbox is open.
          </p>

          <a
            href={links.email}
            data-cursor="Write"
            className="display mt-8 inline-block text-[clamp(1.5rem,4.6vw,3.4rem)] break-all underline decoration-mustard decoration-[3px] underline-offset-[10px] hover:text-mustard"
          >
            {profile.email}
          </a>

          <div className="mt-10 flex flex-wrap gap-4 text-ink">
            <button type="button" onClick={copy} className="btn bg-cream" aria-live="polite" data-cursor={copied ? "Copied" : "Copy"}>
              {copied ? "Copied ✓" : "Copy email"}
            </button>
            <a href={links.github} target="_blank" rel="noreferrer" className="btn bg-mustard" data-cursor="Open">
              <GithubIcon /> GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn bg-mustard" data-cursor="Open">
              <LinkedinIcon /> LinkedIn
            </a>
          </div>
        </Reveal>

        <footer className="relative mt-32 flex flex-wrap items-center justify-between gap-4 border-t-2 border-cream/60 pt-6 text-sm text-cream/80">
          {/* The sun sets on the footer rule */}
          <StripedSun
            className="pointer-events-none absolute right-0 bottom-full w-[46%] sm:w-[34%] lg:w-[26%]"
            colors={["#d9a034", "#c4643a", "#6e3437", "#2e2219"]}
            gap="#a8461f"
          />
          <p>© {new Date().getFullYear()} {profile.name} — made in Nairobi</p>
          <a href="#top" className="font-semibold hover:text-mustard">
            Back to the top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
