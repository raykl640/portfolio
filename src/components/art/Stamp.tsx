import { useId } from "react";

/** Round rubber-stamp badge with text set on a circle. */
export function Stamp({ text, className = "" }: { text: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <path id={id} d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="#f2e7d0" stroke="#2e2219" strokeWidth="3" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="#2e2219" strokeWidth="1.5" strokeDasharray="4 4" />
      <g className="animate-spin-slow" style={{ transformOrigin: "100px 100px" }}>
        <text fill="#2e2219" fontFamily="Bricolage Grotesque, sans-serif" fontSize="15" fontWeight="600" letterSpacing="3.2">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </g>
      <text
        x="100"
        y="114"
        textAnchor="middle"
        fill="#a8461f"
        fontFamily="Fraunces, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="44"
      >
        rl
      </text>
    </svg>
  );
}
