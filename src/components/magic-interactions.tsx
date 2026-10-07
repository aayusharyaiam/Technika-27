"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMagic } from "./experience";

export function MagicInteractions() {
  const pathname = usePathname();
  const { enabled, ready } = useMagic();

  useEffect(() => {
    if (!enabled || !ready) return;
    const cleanup: (() => void)[] = [];
    const ctx = gsap.context(() => {
      gsap.fromTo(".scroll-progress", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .3 } });
      // Distinct scroll speeds give the story section and Great Hall their own depth.
      gsap.utils.toArray<HTMLElement>(".about-crest, .campus-art > img, .delegate-emblem, .owl-moon").forEach((element) => {
        gsap.fromTo(element, { y: 28, rotation: element.classList.contains("about-crest") ? -7 : 0 }, {
          y: -28, rotation: element.classList.contains("about-crest") ? 7 : 0, ease: "none",
          scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: 1.4 },
        });
      });
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const selector = ".event-card, .sponsor-card, .house-card, .academy-card, .memory-card, .order-card";
      const attached = new WeakSet<HTMLElement>();
      const attachCards = () => gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
        if (attached.has(element)) return;
        attached.add(element);
        const x = gsap.quickTo(element, "rotationY", { duration: .45, ease: "power3.out" });
        const y = gsap.quickTo(element, "rotationX", { duration: .45, ease: "power3.out" });
        let rect: DOMRect;
        const enter = () => {
          rect = element.getBoundingClientRect();
          element.classList.add("magic-card-active");
          gsap.to(element, { y: -8, scale: 1.015, duration: .35, ease: "power3.out", overwrite: "auto" });
        };
        const move = (event: PointerEvent) => {
          if (!rect) rect = element.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          x((px - .5) * 9); y((.5 - py) * 9);
          element.style.setProperty("--glow-x", `${px * 100}%`);
          element.style.setProperty("--glow-y", `${py * 100}%`);
        };
        const leave = () => {
          x(0); y(0); element.classList.remove("magic-card-active");
          gsap.to(element, { y: 0, scale: 1, duration: .5, ease: "power3.out", overwrite: "auto" });
        };
        element.addEventListener("pointerenter", enter);
        element.addEventListener("pointermove", move, { passive: true });
        element.addEventListener("pointerleave", leave);
        cleanup.push(() => {
          element.removeEventListener("pointerenter", enter);
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", leave);
          element.classList.remove("magic-card-active");
          gsap.set(element, { clearProps: "transform" });
        });
      });
      attachCards();
      const observer = new MutationObserver((records) => {
        const newCards = records.some((record) => [...record.addedNodes].some((node) =>
          node instanceof Element && (node.matches(selector) || node.querySelector(selector))));
        if (newCards) ctx.add(attachCards);
      });
      const main = document.getElementById("main-content");
      if (main) observer.observe(main, { childList: true, subtree: true });
      cleanup.push(() => observer.disconnect());
    });
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => { window.clearTimeout(refresh); cleanup.forEach((fn) => fn()); ctx.revert(); };
  }, [enabled, ready, pathname]);

  return null;
}
