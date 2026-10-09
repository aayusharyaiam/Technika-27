"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMagic } from "./experience";
import { useHouse } from "./house-provider";

export function GobletTower({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(":", "");
  const { enabled, ready } = useMagic();
  const { theme } = useHouse();
  useEffect(() => {
    if (!enabled || !ready || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".goblet-vessel", { y: -8, duration: 2.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.fromTo(".tower-silhouette", { y: 30 }, { y: -35, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      gsap.to(".goblet-orbit", { rotation: 360, duration: 70, repeat: -1, ease: "none" });
    }, ref);
    return () => ctx.revert();
  }, [enabled, ready]);

  return <div ref={ref} className={`goblet-tower ${compact ? "goblet-compact" : ""}`} role="img" aria-label={`Goblet of Fire in a candlelit ${theme.name} tower`}>
    <Image src="/images/memory-1.webp" fill sizes="(max-width: 700px) 100vw, 50vw" alt="" className="goblet-backdrop" />
    <div className="goblet-scene-shade" /><div className="tower-moon" />
    <svg className="tower-silhouette" viewBox="0 0 360 450" aria-hidden="true"><defs><linearGradient id={`${id}-stone`} x2="1" y2="0"><stop stopColor="#11121a"/><stop offset=".5" stopColor="#282330"/><stop offset="1" stopColor="#111019"/></linearGradient></defs><g fill={`url(#${id}-stone)`} stroke="#b69a5b30"><path d="M60 450V188L105 145L150 188V450Z"/><path d="M90 148V82L105 32L120 82V148Z"/><path d="M200 450V122L245 65L290 122V450Z"/><path d="M226 69V29L245 0L264 29V69Z"/><path d="M143 450V250H213V450Z"/><path d="M45 188H166L105 100Z"/><path d="M187 122H303L245 33Z"/></g><g fill="var(--gold)" opacity=".65">{[0, 1, 2].map((i) => <g key={i}><path d={`M94 ${215 + i * 63}q11-20 22 0v20H94Z`}/><path d={`M234 ${155 + i * 76}q11-20 22 0v25H234Z`}/></g>)}</g><path d="M285 154H312V244L299 255L285 244Z" fill="var(--house-flag)" stroke="var(--house-second)" strokeOpacity=".5"/></svg>
    <div className="goblet-orbit" /><div className="goblet-aura" />
    <div className="goblet-vessel">
      <div className="goblet-fire" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ "--flame-index": i } as React.CSSProperties} />)}<span /></div>
      <svg viewBox="0 0 200 230" className="goblet-svg" aria-hidden="true"><defs><linearGradient id={`${id}-metal`}><stop stopColor="#50341e"/><stop offset=".22" stopColor="#bd9558"/><stop offset=".42" stopColor="#eed9a0"/><stop offset=".57" stopColor="#9b713d"/><stop offset=".85" stopColor="#5e4126"/><stop offset="1" stopColor="#bd9b61"/></linearGradient><radialGradient id={`${id}-inside`}><stop stopColor="#c5f3ff"/><stop offset=".4" stopColor="#48b6ed"/><stop offset="1" stopColor="#203148"/></radialGradient></defs><path d="M42 34L51 86C58 121 78 131 91 135V176L70 190V201H130V190L109 176V135C123 131 143 121 150 86L158 34Z" fill={`url(#${id}-metal)`} stroke="#e2bf7e" strokeWidth="1.5"/><ellipse cx="100" cy="34" rx="59" ry="14" fill={`url(#${id}-inside)`} stroke="#e0c695" strokeWidth="3"/><path d="M55 49C66 114 84 119 99 127M146 49C134 114 116 119 101 127" fill="none" stroke="#50341e" strokeWidth="2"/><path d="M64 52L72 85L84 76L101 111L117 77L129 86L137 53" fill="none" stroke="#edcd8b" strokeWidth="2"/><path d="M91 143H109M90 159H110M73 190H128M67 204H133" stroke="#ebd39b" strokeWidth="2"/><path d="M56 72L65 94M142 72L133 94" stroke="#fff1c3" strokeOpacity=".55"/><ellipse cx="100" cy="211" rx="54" ry="5" fill="#000" opacity=".25"/></svg>
    </div>
    <div className="goblet-embers" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ left: `${25 + i * 17 % 50}%`, animationDelay: `${i * -.43}s`, animationDuration: `${2.4 + i % 4 * .5}s` }} />)}</div>
    <span className="goblet-inscription">IGNIS · INGENIUM · IMMORTALIS</span>
  </div>;
}
