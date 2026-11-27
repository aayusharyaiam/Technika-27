"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./technika.css";
// ⚠️ Adjust this path to wherever your HouseProvider / useHouse lives.
import { useHouse } from "@/components/house-provider";
import { getLogoPalette } from "./house-palette";
import { TechnikaBrand } from "./logo";

/** Intro animation is ~1.1s; this adds a short hold so it never feels cut off. */
const MIN_VISIBLE_MS = 1600;
/** Safety net: never keep people waiting longer than this. */
const MAX_WAIT_MS = 6000;
/** Duration of the logo flying into the navbar. */
const FLY_MS = 850;

/**
 * Full-screen intro. Plays the outline → fill → glow sequence, waits for
 * the page (window load + fonts), then flies the logo into the navbar
 * brand slot (`[data-tk-nav-brand]`) and calls `onLanded`.
 *
 * Render it while loading and unmount it from `onLanded` (see shell.tsx).
 */
export function TechnikaLoader({ onLanded }: { onLanded?: () => void }) {
  const { house } = useHouse();
  const palette = getLogoPalette(house);
  const [phase, setPhase] = useState<"intro" | "fly">("intro");
  const brandRef = useRef<HTMLDivElement>(null);

  const onLandedRef = useRef(onLanded);
  useEffect(() => {
    onLandedRef.current = onLanded;
  });

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Lock scroll while the loader is up
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let cancelled = false;
    let flight: Animation | undefined;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) =>
        timers.push(window.setTimeout(resolve, ms)),
      );

    const pageLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true }),
          );
    const fontsReady = document.fonts
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve();

    const ready = Promise.race([
      Promise.all([
        wait(reduceMotion ? 250 : MIN_VISIBLE_MS),
        pageLoaded,
        fontsReady,
      ]),
      wait(MAX_WAIT_MS),
    ]);

    ready.then(() => {
      if (cancelled) return;
      setPhase("fly");

      const brand = brandRef.current;
      const target = document.querySelector<HTMLElement>("[data-tk-nav-brand]");

      // No navbar to land on (or reduced motion): just fade out.
      if (!brand || !target || reduceMotion) {
        timers.push(
          window.setTimeout(() => !cancelled && onLandedRef.current?.(), 450),
        );
        return;
      }

      // FLIP: measure both lockups, then scale + translate the loader one onto the navbar one.
      const from = brand.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const scale = to.width / from.width;

      flight = brand.animate(
        [
          { transform: "translate3d(0, 0, 0) scale(1)" },
          {
            transform: `translate3d(${to.left - from.left}px, ${to.top - from.top}px, 0) scale(${scale})`,
          },
        ],
        {
          duration: FLY_MS,
          easing: "cubic-bezier(0.76, 0, 0.24, 1)",
          fill: "forwards",
        },
      );
      flight.onfinish = () => {
        if (!cancelled) onLandedRef.current?.();
      };
    });

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      flight?.cancel();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Technika"
      data-phase={phase}
      className="tk-loader fixed inset-0 z-[100] overflow-hidden"
      style={{ "--tk-glow": palette.glow } as CSSProperties}
    >
      <div className="tk-loader-bg absolute inset-0 bg-[#0a0a0a]" />

      <div className="tk-glow pointer-events-none absolute inset-0 grid place-items-center">
        <div className="tk-glow-core aspect-square w-[min(120vw,46rem)] rounded-full" />
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <div
          ref={brandRef}
          className="tk-loader-brand flex w-max origin-top-left"
        >
          <TechnikaBrand className="text-[clamp(2.75rem,9vw,8rem)]" />
        </div>
      </div>
    </div>
  );
}
