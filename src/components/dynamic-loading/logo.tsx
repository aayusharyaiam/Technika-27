"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
// ⚠️ Adjust this path to wherever your HouseProvider / useHouse lives.
import { useHouse } from "@/components/house-provider";
import { getLogoPalette } from "./house-palette";

/** Tight crop around the T mark (traced from the supplied PNGs). */
const VIEWBOX = "94 130 1169 924";

/**
 * The three polygons that make up the mark.
 * `len` is each outline's exact length – the loader uses it to "draw" the
 * outline. `delay` staggers the three shapes so they trace one after another.
 */
const SHAPES = [
  // main T + diagonal stem
  {
    d: "M95 131 L245 287 H653 L704 341 V1053 L862 885 V316 L703 131 Z",
    len: 3063,
    delay: "0s",
  },
  // top-right wing
  { d: "M763 131 L898 287 H1116 L1262 131 Z", len: 1137, delay: "0.14s" },
  // inner stem
  { d: "M507 323 H636 L671 360 V1053 L507 885 Z", len: 1670, delay: "0.28s" },
];

/**
 * The Technika "T" as inline SVG. Colours follow the active house and
 * glide to the new gradient when the house changes.
 *
 * Inside the loader, each shape's outline is drawn in the house gradient and
 * then the fill fades in (see technika.css).
 */
export function TechnikaMark({ className = "" }: { className?: string }) {
  const { house } = useHouse();
  const palette = getLogoPalette(house);
  const gradientId = `tk-grad-${useId().replace(/:/g, "")}`;
  const stop = (color: string) => ({
    stopColor: color,
    transition: "stop-color 500ms ease",
  });

  return (
    <svg
      viewBox={VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="131"
          x2="0"
          y2="1053"
        >
          <stop offset="0" style={stop(palette.top)} />
          <stop offset="0.5" style={stop(palette.mid)} />
          <stop offset="1" style={stop(palette.bottom)} />
        </linearGradient>
      </defs>
      {SHAPES.map(({ d, len, delay }) => (
        <path
          key={d}
          d={d}
          className="tk-shape"
          style={{ "--tk-len": len, "--tk-delay": delay } as CSSProperties}
          fill={`url(#${gradientId})`}
          stroke={`url(#${gradientId})`}
          strokeOpacity={0}
          strokeWidth={18}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The "Technika" text. With `intro`, an SVG copy of the text sits on top so its
 * outline can be drawn stroke by stroke – it uses whatever font the text uses.
 * The colour comes from your theme's `text-fg-brand` utility.
 */
function Wordmark({ intro }: { intro: boolean }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const baselineRef = useRef<HTMLElement>(null);
  const [baseline, setBaseline] = useState<number | null>(null);

  // Find the text baseline so the SVG copy lines up with the real text exactly.
  useIsoLayoutEffect(() => {
    if (!intro) return;
    const wrap = wrapRef.current;
    const marker = baselineRef.current;
    if (!wrap || !marker) return;

    let active = true;
    const measure = () => {
      if (!active) return;
      const w = wrap.getBoundingClientRect();
      const m = marker.getBoundingClientRect();
      const scale = w.width / (wrap.offsetWidth || w.width) || 1; // ignore any CSS transform
      setBaseline((m.top - w.top) / scale);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    const fonts = document.fonts;
    fonts?.ready.then(measure); // re-measure once the HarryP web font loads
    fonts?.addEventListener?.("loadingdone", measure);
    return () => {
      active = false;
      observer.disconnect();
      fonts?.removeEventListener?.("loadingdone", measure);
    };
  }, [intro]);

  return (
    <span
      ref={wrapRef}
      className="tk-wordmark relative inline-block text-fg-brand"
    >
      <span className="tk-word-fill">
        Technika
        {intro && (
          <i ref={baselineRef} className="tk-baseline" aria-hidden="true" />
        )}
      </span>
      {intro && baseline !== null && (
        <svg className="tk-word-outline" aria-hidden="true" focusable="false">
          <text x="0" y={baseline}>
            Technika
          </text>
        </svg>
      )}
    </span>
  );
}

/**
 * Mark + "Technika" wordmark. Everything is sized in `em`, so the size
 * is controlled by a single font-size class (e.g. `text-[1.75rem]`).
 * Wordmark font / spacing / alignment can be tuned with the --tk-* variables in technika.css.
 * The loader and the navbar render this same lockup, which is what
 * lets the loader logo fly into the navbar seamlessly.
 *
 * `intro` is only used by the loader (adds the outline-drawing layer).
 */
export function TechnikaBrand({
  className = "",
  intro = false,
}: {
  className?: string;
  intro?: boolean;
}) {
  return (
    <span
      className={`tk-brand inline-flex items-center whitespace-nowrap leading-none ${className}`}
    >
      <TechnikaMark className="tk-mark w-auto shrink-0" />
      <Wordmark intro={intro} />
    </span>
  );
}
