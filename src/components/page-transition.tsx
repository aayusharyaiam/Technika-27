"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMagic } from "./experience";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const previous = useRef(pathname);
  const { enabled, ready } = useMagic();

  useEffect(() => {
    if (!ready) return;
    const changed = previous.current !== pathname;
    previous.current = pathname;
    const ctx = gsap.context(() => {
      if (!enabled) return;
      gsap.fromTo(ref.current, { opacity: 0, y: changed ? 24 : 0 }, { opacity: 1, y: 0, duration: .8, ease: "power3.out", clearProps: "transform" });
      if (changed) {
        gsap.fromTo(veil.current, { scaleY: 1, transformOrigin: "top", opacity: 1 }, { scaleY: 0, duration: .8, ease: "power4.inOut", onComplete: () => { ScrollTrigger.refresh(); } });
      }
    });
    return () => ctx.revert();
  }, [pathname, enabled, ready]);

  return <><div className="route-spell-veil" ref={veil} aria-hidden="true"><span>✦</span></div><div ref={ref} className="page-transition">{children}</div></>;
}
