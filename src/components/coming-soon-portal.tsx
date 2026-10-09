"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Instagram, MapPin } from "lucide-react";
import { SnitchArtwork } from "./ornaments";

function WanderingSnitch() {
  const snitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = snitchRef.current;
    if (!el) return;

    let posX = window.innerWidth * 0.5;
    let posY = window.innerHeight * 0.35;
    let heading = Math.random() * Math.PI * 2;
    let bankAngle = 0;
    const speed = 2.8; // consistent cruising speed

    let time = 0;
    let rafId: number;

    const animate = () => {
      time += 0.008; // slow time progression for wide sweeping curves, preventing small loops

      // Gentle, broad sweeping undulation (wavelength is very long, cannot loop into small circles)
      const gentleCurve =
        Math.sin(time * 0.7) * 0.012 + Math.cos(time * 0.35) * 0.009;
      heading += gentleCurve;

      // Strict boundaries with snitch half-width/height consideration (cannot leave screen)
      const minX = 70;
      const maxX = window.innerWidth - 70;
      const minY = 60;
      const maxY = window.innerHeight - 60;

      // Smooth geometric reflection off the screen walls:
      // When heading towards the left wall and crossing boundary, redirect inward
      let vx = Math.cos(heading);
      let vy = Math.sin(heading);

      if (posX <= minX && vx < 0) {
        vx = Math.abs(vx);
        heading = Math.atan2(vy, vx);
      } else if (posX >= maxX && vx > 0) {
        vx = -Math.abs(vx);
        heading = Math.atan2(vy, vx);
      }

      if (posY <= minY && vy < 0) {
        vy = Math.abs(vy);
        heading = Math.atan2(vy, vx);
      } else if (posY >= maxY && vy > 0) {
        vy = -Math.abs(vy);
        heading = Math.atan2(vy, vx);
      }

      // Hard clamp positions to absolutely guarantee it never leaves website boundaries
      posX = Math.max(minX, Math.min(maxX, posX + Math.cos(heading) * speed));
      posY = Math.max(minY, Math.min(maxY, posY + Math.sin(heading) * speed));

      // Natural banking tilt proportional to horizontal velocity and curvature
      const targetBank = Math.max(-28, Math.min(28, Math.cos(heading) * 18 + gentleCurve * 800));
      bankAngle += (targetBank - bankAngle) * 0.08;

      el.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${bankAngle}deg)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="reference-snitch-realm" aria-hidden="true">
      <div className="reference-snitch" ref={snitchRef}>
        <span className="reference-snitch-halo" />
        <SnitchArtwork />
      </div>
    </div>
  );
}

export function ComingSoonPortal() {
  return (
    <div className="reference-portal-stage">
      {/* Dynamic Wandering Golden Snitch */}
      <WanderingSnitch />

      {/* Atmospheric Hogwarts Castle and Night Sky Backdrop */}
      <div className="reference-backdrop" aria-hidden="true">
        <Image
          src="/images/hogwarts.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="reference-castle-img"
        />
        {/* Full moon overlay */}
        <div className="reference-full-moon" />
        {/* Vignette & mystical darkness gradient */}
        <div className="reference-dark-overlay" />
      </div>

      {/* Elegant Golden Border Frame with Ornamental Corners */}
      <div className="reference-frame" aria-hidden="true">
        <span className="corner top-left" />
        <span className="corner top-right" />
        <span className="corner bottom-left" />
        <span className="corner bottom-right" />
      </div>

      {/* Main Content Card Container */}
      <main className="reference-container">
        {/* Top Header: ✦ BIT PATNA PRESENTS ✦ */}
        <div className="reference-presents">
          <span className="golden-wing left" />
          <span className="star-ornament">✦</span>
          <p className="presents-text">BIT PATNA PRESENTS</p>
          <span className="star-ornament">✦</span>
          <span className="golden-wing right" />
        </div>

        {/* Golden Circular Seal / Crest */}
        <div className="reference-seal-wrap">
          <div className="reference-seal-glow" aria-hidden="true" />
          <Image
            src="/technika.png"
            alt="Technika Logo"
            width={96}
            height={96}
            priority
            className="reference-seal-img brightness-0 invert"
          />
        </div>

        {/* Subtitle Overline */}
        <div className="reference-overline">
          THE NEXT CHAPTER IS BEING WRITTEN
        </div>

        {/* Flagship Title: TECHNIKA '27 */}
        <h1 className="reference-title" aria-label="Technika 27">
          <span className="reference-title-word">Technika</span>
          <span className="reference-title-year">’27</span>
        </h1>

        {/* Curvie Golden Display: COMING SOON */}
        <div className="reference-coming-soon">
          <span>COMING SOON</span>
        </div>

        {/* Lore / Description */}
        <p className="reference-description">
          A new spell of technology, creativity, and wonder is taking shape at
          BIT Patna.
        </p>

        {/* Bottom Dual Card Box */}
        <div className="reference-status-card">
          {/* Left Column: The gates are preparing / Opening soon */}
          <div className="status-col left-col">
            <span className="status-label">THE GATES ARE PREPARING</span>
            <h2 className="status-headline">Opening soon</h2>
            <a
              href="https://maps.app.goo.gl/eBPKaTah37o2mWLM6"
              target="_blank"
              rel="noopener noreferrer"
              className="status-location"
              title="View BIT Patna on Google Maps"
              aria-label="View BIT Patna on Google Maps"
            >
              <MapPin size={12} className="loc-pin" />
              <span>BIT PATNA · INDIA</span>
            </a>
          </div>

          {/* Vertical Divider */}
          <div className="status-divider" aria-hidden="true" />

          {/* Right Column: Instagram Portal Link */}
          <div className="status-col right-col">
            <a
              href="https://www.instagram.com/technika_bitp?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="status-instagram-link"
              aria-label="Visit Technika BIT Patna on Instagram"
            >
              <div className="instagram-icon-box">
                <Instagram size={22} className="instagram-glyph" />
              </div>
              <div className="instagram-text-wrap">
                <span className="instagram-label">OFFICIAL INSTAGRAM</span>
                <span className="instagram-handle">@technika_bitp</span>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
