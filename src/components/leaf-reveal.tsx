"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function LeafReveal() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    // Dismiss and unmount leaves from the DOM after the fly-through animation completes
    const timer = setTimeout(() => {
      setActive(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <aside
      className="leaf-reveal"
      aria-hidden="true"
      data-state="active"
    >
      <div className="leaf-reveal__perspective">
        {/* Left foliage layer */}
        <div className="leaf-reveal__panel leaf-reveal__panel--left">
          <Image
            src="/images/leaves.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 90vw, 65vw"
          />
        </div>

        {/* Right foliage layer (mirrored horizontally) */}
        <div className="leaf-reveal__panel leaf-reveal__panel--right">
          <Image
            src="/images/leaves.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 90vw, 65vw"
          />
        </div>

        {/* Subtle center tunnel glow during transition */}
        <div className="leaf-reveal__tunnel" />
      </div>
    </aside>
  );
}

