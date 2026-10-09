"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function WandCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let x = 0; let y = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX; y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x - 5}px,${y - 5}px,0)`;
        cursor.style.opacity = "1";
        document.documentElement.dataset.wand = "ready";
        const target = document.elementFromPoint(x, y);
        const text = target?.closest("input, textarea, [contenteditable=true]");
        cursor.style.opacity = text ? "0" : "1";
        frame = 0;
      });
    };
    const hide = () => { cursor.style.opacity = "0"; delete document.documentElement.dataset.wand; };
    const down = () => cursor.classList.add("wand-casting");
    const up = () => cursor.classList.remove("wand-casting");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => { cancelAnimationFrame(frame); hide(); window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", hide); window.removeEventListener("blur", hide); window.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); };
  }, []);
  return <div className="wand-cursor-viewport" aria-hidden="true"><div ref={ref} className="photographic-wand"><Image src="/images/wand-pointer.png" width={104} height={104} alt="" unoptimized/><span /></div></div>;
}
