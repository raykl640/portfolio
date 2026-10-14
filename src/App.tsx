import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { startSmoothScroll } from "./lib/scroll";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { About } from "./components/About";
import { Record } from "./components/Record";
import { Contact } from "./components/Contact";
import { InkCursor } from "./components/ui/InkCursor";

export default function App() {
  useEffect(() => startSmoothScroll(), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain" aria-hidden />
      <InkCursor />
      <Navbar />
      <main>
        <Hero />
        <Work />
        <About />
        <Record />
        <Contact />
      </main>
    </MotionConfig>
  );
}
