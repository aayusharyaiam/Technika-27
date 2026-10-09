"use client";

import { useHouse } from "./house-provider";

export function HouseBanners({ className = "" }: { className?: string }) {
  const { house, theme } = useHouse();
  return <div className={`house-banners ${className}`} data-selected-house={house} aria-hidden="true">
    {["left", "right"].map((side) => <div key={side} className={`house-banner house-banner-${side}`}>
      <div className="banner-rod" /><svg viewBox="0 0 90 180" fill="none"><defs><linearGradient id={`fabric-${side}`} x1="0" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="var(--house-flag)" /><stop offset=".5" stopColor="var(--house-flag)" /><stop offset="1" stopColor="#08070d" /></linearGradient></defs><path d="M5 0H85V149L45 176L5 149Z" fill={`url(#fabric-${side})`} /><path d="M12 3H78V145L45 166L12 145Z" stroke="var(--house-second)" strokeOpacity=".6" /><path d="M0 20H90M0 25H90" stroke="var(--house-second)" strokeOpacity=".4" /><path d="M45 48L67 56V79C67 99 45 111 45 111S23 99 23 79V56Z" stroke="var(--house-second)" strokeWidth="1.4" /><text x="45" y="88" textAnchor="middle" fill="var(--house-second)" fontFamily="Georgia,serif" fontSize="30">{theme.initial}</text><path d="M35 120H55M39 125H51" stroke="var(--house-second)" strokeOpacity=".6" /></svg>
    </div>)}
    <span className="castle-house-caption">{house === "default" ? "THE ENCHANTED REALM" : `${theme.name.toUpperCase()} COMMON ROOM`}</span>
  </div>;
}
