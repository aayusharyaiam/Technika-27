"use client";

import { useEffect, useRef, useState } from "react";
import "./technika.css";
import { TechnikaBrand } from "./logo";

/** Intro animation is ~1.9s (draw outline, then fill); this adds a short hold. */
const MIN_VISIBLE_MS = 2400;
/** Safety net: never keep people waiting longer than this. */
const MAX_WAIT_MS = 6000;
/** Duration of the logo flying into the navbar. */
const FLY_MS = 850;

/**
 * Full-screen intro. Draws the outline, fills it with the house colour, waits for
 * the page (window load + fonts), then flies the logo into the navbar
 * brand slot (`[data-tk-nav-brand]`) and calls `onLanded`.
 *
 * Render it while loading and unmount it from `onLanded` (see shell.tsx).
 */
export function TechnikaLoader({
  onReveal,
  onLanded,
}: {
  onReveal?: () => void;
  onLanded?: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "intro" | "fly">("idle");
  const brandRef = useRef<HTMLDivElement>(null);

  const onRevealRef = useRef(onReveal);
  const onLandedRef = useRef(onLanded);
  useEffect(() => {
    onRevealRef.current = onReveal;
    onLandedRef.current = onLanded;
  });

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Lock both native scroll and Lenis smooth scroll while the loader is visible
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (
      window as unknown as { lenis?: { stop?: () => void; start?: () => void } }
    ).lenis;
    lenis?.stop?.();

    let cancelled = false;
    let didLand = false;
    let flight: Animation | undefined;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) =>
        timers.push(window.setTimeout(resolve, ms)),
      );
    const finish = () => {
      if (cancelled || didLand) return;
      didLand = true;
      onLandedRef.current?.();
    };

    // Start the intro once the wordmark font is ready (max 800ms), so the outline
    // is never drawn in a fallback font. Guard so a late font resolve never reverts "fly".
    const fontReady = document.fonts
      ? Promise.race([document.fonts.ready.then(() => undefined), wait(800)])
      : Promise.resolve();
    fontReady.then(() => {
      if (!cancelled) {
        setPhase((prev) => (prev === "idle" ? "intro" : prev));
      }
    });

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
      onRevealRef.current?.();

      const brand = brandRef.current;
      const target = document.querySelector<HTMLElement>("[data-tk-nav-brand]");

      if (reduceMotion) {
        timers.push(window.setTimeout(finish, 200));
        return;
      }

      if (!brand || !target || typeof brand.animate !== "function") {
        timers.push(window.setTimeout(finish, 450));
        return;
      }

      const from = brand.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (from.width <= 0 || to.width <= 0) {
        timers.push(window.setTimeout(finish, 450));
        return;
      }

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
      flight.onfinish = finish;
      // Fallback ensures background-throttled tabs never trap the loader open
      timers.push(window.setTimeout(finish, FLY_MS + 250));
    });

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      flight?.cancel();
      document.body.style.overflow = previousOverflow;
      lenis?.start?.();
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Technika"
      data-phase={phase}
      data-lenis-prevent
      className="tk-loader fixed inset-0 z-[100] overflow-hidden"
    >
      <div className="tk-loader-bg absolute inset-0 bg-[#080808] motion-reduce:transition-none" />

      <div className="absolute inset-0 grid place-items-center">
        <div
          ref={brandRef}
          className="tk-loader-brand flex w-max origin-top-left"
        >
          <TechnikaBrand intro className="text-[clamp(2.75rem,9vw,8rem)]" />
        </div>
      </div>
    </div>
  );
}
