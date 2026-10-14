import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#record", label: "Record" },
  { href: "#contact", label: "Contact" },
];

// Magazine-style running head: which "page" of the issue you're on
const pages = [
  { id: "top", label: "Cover" },
  { id: "work", label: "Selected work" },
  { id: "about", label: "About me" },
  { id: "record", label: "The paperwork" },
  { id: "contact", label: "Write to me" },
];

function useCurrentPage() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const els = pages.map((p) => document.getElementById(p.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(pages.findIndex((p) => p.id === e.target.id));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return current;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const page = useCurrentPage();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b-2 border-ink bg-paper" : "border-b-2 border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3.5 sm:px-8">
        <a href="#top" className="display text-2xl font-semibold italic" aria-label="Ray Lukorito, back to top">
          Ray L<span className="text-rust">.</span>
        </a>

        <p
          aria-live="polite"
          className={`hidden text-xs font-semibold tracking-[0.16em] uppercase transition-opacity duration-300 lg:block ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="display mr-2 text-base tracking-normal text-rust normal-case italic">
            p. {String(page + 1).padStart(2, "0")}
          </span>
          {pages[page].label}
        </p>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="squiggle text-[15px] font-medium">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold md:hidden"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Reading progress, printed as a rust rule along the bottom of the header */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className={`absolute inset-x-0 -bottom-[2px] h-[3px] origin-left bg-rust transition-opacity ${scrolled ? "opacity-100" : "opacity-0"}`}
      />

      {open && (
        <ul className="border-t-2 border-dashed border-ink/40 px-4 pt-2 pb-6 md:hidden">
          {navLinks.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="display flex items-baseline gap-4 py-2 text-4xl font-semibold"
              >
                <span className="font-hand text-xl text-rust">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
