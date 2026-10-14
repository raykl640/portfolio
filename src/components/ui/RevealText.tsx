import { motion } from "motion/react";
import type { ReactNode } from "react";

type Tag = "h1" | "h2" | "h3" | "p";

/** Headline that rises out of a mask when it scrolls into view. */
export function RevealText({
  as: As = "h2",
  className = "",
  delay = 0,
  children,
}: {
  as?: Tag;
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <As className={className}>
      <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
        <motion.span
          className="block"
          initial={{ y: "110%", rotate: 2 }}
          whileInView={{ y: "0%", rotate: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay }}
        >
          {children}
        </motion.span>
      </span>
    </As>
  );
}
