import { useId, type ReactNode } from "react";
import type { PosterKind } from "../../data/content";

// Palette mirrors the @theme tokens in index.css
export const c = {
  paper: "#e5d4b5",
  paperDeep: "#d9c29b",
  cream: "#f2e7d0",
  ink: "#2e2219",
  rust: "#a8461f",
  rustLight: "#c4643a",
  mustard: "#d9a034",
  pine: "#3b5e54",
  pineDeep: "#2f4c44",
  wine: "#6e3437",
};

/** A poster is split into depth layers (back → front) so it can open up like a pop-up book. */
export type PosterLayers = ReactNode[];

function Dots({ id, color = c.ink, size = 8 }: { id: string; color?: string; size?: number }) {
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      <circle cx={size / 2} cy={size / 2} r={size / 5} fill={color} />
    </pattern>
  );
}

const label = (x: number, y: number, fill: string, text: string, size = 20, weight = 400) => (
  <text x={x} y={y} fill={fill} fontFamily="Fraunces, serif" fontStyle="italic" fontSize={size} fontWeight={weight}>
    {text}
  </text>
);

function haki(uid: string): PosterLayers {
  return [
    (
      <>
        <defs>
          <Dots id={`${uid}-d`} />
          <clipPath id={`${uid}-sun`}>
            <circle cx="200" cy="200" r="120" />
          </clipPath>
        </defs>
        <rect width="400" height="500" fill={c.mustard} />
        <circle cx="210" cy="208" r="120" fill={c.wine} opacity="0.55" />
        <circle cx="200" cy="200" r="120" fill={c.rust} />
        <rect width="400" height="500" fill={`url(#${uid}-d)`} opacity="0.25" clipPath={`url(#${uid}-sun)`} />
        <rect y="360" width="400" height="140" fill={c.paperDeep} />
        <rect y="372" width="400" height="10" fill={c.rust} />
        <rect y="390" width="400" height="6" fill={c.rust} />
        <rect y="403" width="400" height="3" fill={c.rust} />
        {label(26, 466, c.ink, "haki", 30, 600)}
        {label(100, 466, c.ink, "(n.) justice", 17)}
      </>
    ),
    (
      <>
        <circle cx="200" cy="104" r="12" fill={c.ink} />
        <rect x="195" y="110" width="10" height="250" rx="3" fill={c.ink} />
        <rect x="85" y="145" width="230" height="10" rx="5" fill={c.ink} transform="rotate(-7 200 150)" />
        <path d="M86 164 L50 262 M86 164 L122 262 M314 136 L278 234 M314 136 L350 234" stroke={c.ink} strokeWidth="3" />
        <path d="M42 262 Q86 304 130 262 Z" fill={c.ink} />
        <path d="M270 234 Q314 276 358 234 Z" fill={c.ink} />
        <path d="M150 362 L250 362 L232 336 L168 336 Z" fill={c.ink} />
      </>
    ),
  ];
}

function carnation(uid: string): PosterLayers {
  const outer = Array.from({ length: 10 }, (_, i) => {
    const a = (i * 36 * Math.PI) / 180;
    return [200 + 48 * Math.cos(a), 196 + 48 * Math.sin(a)];
  });
  const inner = Array.from({ length: 7 }, (_, i) => {
    const a = ((i * 360) / 7 + 20) * (Math.PI / 180);
    return [200 + 24 * Math.cos(a), 196 + 24 * Math.sin(a)];
  });
  return [
    (
      <>
        <defs>
          <Dots id={`${uid}-d`} color={c.cream} />
        </defs>
        <rect width="400" height="500" fill={c.pine} />
        <circle cx="200" cy="215" r="160" fill={c.pineDeep} />
        <circle cx="200" cy="215" r="160" fill={`url(#${uid}-d)`} opacity="0.12" />
        <path
          d="M0 440 Q 25 420 50 440 T 100 440 T 150 440 T 200 440 T 250 440 T 300 440 T 350 440 T 400 440"
          stroke={c.mustard}
          strokeWidth="5"
          fill="none"
        />
        {label(26, 482, c.cream, "temp · humidity · air", 18)}
      </>
    ),
    (
      <>
        <rect x="322" y="70" width="28" height="210" rx="14" fill={c.cream} />
        <rect x="331" y="150" width="10" height="130" rx="5" fill={c.rust} />
        <circle cx="336" cy="292" r="24" fill={c.cream} />
        <circle cx="336" cy="292" r="15" fill={c.rust} />
        {[100, 125, 150, 175, 200, 225].map((y) => (
          <rect key={y} x="306" y={y} width="10" height="3" fill={c.cream} />
        ))}
      </>
    ),
    (
      <>
        <path d="M200 470 C 194 410 212 340 200 250" stroke={c.cream} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M199 392 C 160 384 138 356 128 332 C 166 336 190 356 199 380 Z" fill={c.cream} />
        <path d="M203 338 C 242 330 264 300 272 278 C 238 284 212 304 203 326 Z" fill={c.cream} />
        {outer.map(([x, y], i) => (
          <circle key={`w${i}`} cx={x + 6} cy={y + 5} r="34" fill={c.wine} />
        ))}
        {outer.map(([x, y], i) => (
          <circle key={`o${i}`} cx={x} cy={y} r="34" fill={c.rust} />
        ))}
        {inner.map(([x, y], i) => (
          <circle key={`i${i}`} cx={x} cy={y} r="26" fill={c.rustLight} />
        ))}
        <circle cx="200" cy="196" r="20" fill={c.wine} />
      </>
    ),
  ];
}

function crop(uid: string): PosterLayers {
  const furrows = [-500, -260, -90, 60, 200, 340, 490, 660, 900];
  return [
    (
      <>
        <defs>
          <Dots id={`${uid}-d`} />
          <clipPath id={`${uid}-sky`}>
            <rect width="400" height="270" />
          </clipPath>
        </defs>
        <rect width="400" height="500" fill={c.rust} />
        <g clipPath={`url(#${uid}-sky)`}>
          <circle cx="200" cy="270" r="128" fill={c.mustard} />
          <rect y="198" width="400" height="5" fill={c.rust} />
          <rect y="218" width="400" height="8" fill={c.rust} />
          <rect y="240" width="400" height="11" fill={c.rust} />
          <rect y="262" width="400" height="14" fill={c.rust} />
        </g>
        <rect y="270" width="400" height="230" fill={c.pine} />
        {furrows.map((x) => (
          <line key={x} x1="200" y1="272" x2={x} y2="500" stroke={c.pineDeep} strokeWidth="7" />
        ))}
        <rect y="270" width="400" height="230" fill={`url(#${uid}-d)`} opacity="0.18" />
        {label(26, 58, c.cream, "what grows here?", 24, 600)}
      </>
    ),
    <ellipse key="mound" cx="200" cy="474" rx="70" ry="16" fill={c.wine} />,
    (
      <>
        <path d="M200 470 L200 396" stroke={c.cream} strokeWidth="7" strokeLinecap="round" />
        <path d="M199 418 C 166 414 150 392 146 372 C 174 374 194 392 199 412 Z" fill={c.cream} />
        <path d="M201 404 C 232 398 248 376 252 356 C 224 360 206 378 201 398 Z" fill={c.cream} />
      </>
    ),
  ];
}

function medical(uid: string): PosterLayers {
  return [
    (
      <>
        <defs>
          <Dots id={`${uid}-d`} color={c.mustard} size={10} />
        </defs>
        <rect width="400" height="500" fill={c.wine} />
        <circle cx="270" cy="190" r="170" fill={`url(#${uid}-d)`} opacity="0.5" />
        {label(26, 466, c.cream, "for the specialists", 22)}
      </>
    ),
    (
      <>
        <g transform="translate(10 10)" fill={c.mustard}>
          <rect x="150" y="110" width="100" height="270" rx="18" />
          <rect x="65" y="195" width="270" height="100" rx="18" />
        </g>
        <g fill={c.cream}>
          <rect x="150" y="110" width="100" height="270" rx="18" />
          <rect x="65" y="195" width="270" height="100" rx="18" />
        </g>
      </>
    ),
    (
      <polyline
        points="34,245 118,245 140,245 160,195 182,305 204,165 226,280 244,245 366,245"
        fill="none"
        stroke={c.rust}
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  ];
}

const builders: Record<PosterKind, (uid: string) => PosterLayers> = { haki, carnation, crop, medical };

export function usePosterLayers(kind: PosterKind) {
  const uid = useId().replace(/:/g, "");
  return builders[kind](uid);
}

export function PosterSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 500" className="block h-auto w-full" aria-hidden>
      {children}
    </svg>
  );
}

/** 70s-style striped half-sun used as a recurring motif. */
export function StripedSun({
  className = "",
  colors = [c.mustard, c.rustLight, c.rust, c.wine],
  gap = c.paper,
}: {
  className?: string;
  colors?: string[];
  gap?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const bands = [
    { y: 0, h: 88 },
    { y: 94, h: 38 },
    { y: 140, h: 26 },
    { y: 175, h: 16 },
  ];
  return (
    <svg viewBox="0 0 400 200" className={className} aria-hidden>
      <defs>
        <clipPath id={`${uid}-half`}>
          <path d="M0 200 A200 200 0 0 1 400 200 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-half)`}>
        <rect width="400" height="200" fill={gap} />
        {bands.map((b, i) => (
          <rect key={i} y={b.y} width="400" height={b.h} fill={colors[i % colors.length]} />
        ))}
      </g>
    </svg>
  );
}
