"use client";

import Image from "next/image";
import { MapPin, Sparkles } from "lucide-react";

export function ComingSoonHero() {
  return <section className="coming-soon-hero" aria-labelledby="coming-soon-title">
    <div className="coming-hero-backdrop"><Image src="/images/hogwarts.webp" alt="A moonlit castle rising above the mist" fill priority sizes="100vw" quality={75} /></div>
    <div className="coming-hero-shade" />
    <div className="coming-celestial-glow" aria-hidden="true" />
    <div className="coming-moon" aria-hidden="true" />
    <div className="coming-hero-frame" aria-hidden="true" />

    <div className="coming-hero-content">
      <p className="coming-presents"><span /><span className="coming-presents-mark"><Sparkles size={12} /> BIT PATNA PRESENTS <Sparkles size={12} /></span><span /></p>
      <div className="coming-crest" aria-hidden="true"><span /><Image src="/images/crest.webp" alt="" width={130} height={130} priority /></div>
      <p className="coming-kicker">The next chapter is being written</p>
      <h1 id="coming-soon-title" className="coming-title" aria-label="Technika 27 coming soon"><span>TECHNIKA</span><b><i>’</i>27</b></h1>
      <p className="coming-soon-label">Coming soon</p>
      <div className="coming-divider" aria-hidden="true"><span /><b>✦</b><span /></div>
      <p className="coming-description">A new spell of technology, creativity, and wonder is taking shape at BIT Patna.</p>

      <div className="coming-launch-card coming-launch-card--simple">
        <div className="coming-launch-heading"><span>The gates are preparing</span><strong>Opening soon</strong><small><MapPin size={11} /> BIT PATNA · INDIA</small></div>
        <p className="coming-watch-note"><Sparkles size={14} /> Keep watch for the official announcement.</p>
      </div>
    </div>
  </section>;
}
