"use client";

import { useId } from "react";
// ⚠️ Adjust this path to wherever your HouseProvider / useHouse lives.
import { useHouse } from "@/components/house-provider";
import { getLogoPalette } from "./house-palette";

/** Tight crop around the T mark (traced from the supplied PNGs). */
const VIEWBOX = "94 130 1169 924";

/** The three polygons that make up the mark. */
const SHAPES = [
  // main T + diagonal stem
  "M95 131 L245 287 H653 L704 341 V1053 L862 885 V316 L703 131 Z",
  // top-right wing
  "M763 131 L898 287 H1116 L1262 131 Z",
  // inner stem
  "M507 323 H636 L671 360 V1053 L507 885 Z",
];

/**
 * The Technika "T" as inline SVG. Colours follow the active house and
 * glide to the new gradient when the house changes.
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
      {SHAPES.map((d) => (
        <path
          key={d}
          d={d}
          className="tk-shape"
          fill={`url(#${gradientId})`}
          stroke="#fff"
          strokeOpacity={0}
          strokeWidth={1.25}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/**
 * Mark + "Technika" wordmark. Everything is sized in `em`, so the size
 * is controlled by a single font-size class (e.g. `text-[1.75rem]`).
 * The loader and the navbar render this same lockup, which is what
 * lets the loader logo fly into the navbar seamlessly.
 */
export function TechnikaBrand({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-[0.32em] whitespace-nowrap leading-none ${className}`}
    >
      <TechnikaMark className="h-[0.82em] w-auto shrink-0" />
      <span className="tk-wordmark text-white">Technika</span>
    </span>
  );
}
