"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, BookOpen, MapPin, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { AmbientParticles, SnitchArtwork } from "./ornaments";
import { useMagic } from "./experience";
import { HouseBanners } from "./house-banners";

function GoldenSnitch() {
  const realmRef = useRef<HTMLDivElement>(null);
  const snitchRef = useRef<HTMLDivElement>(null);
  const { enabled, ready } = useMagic();

  useEffect(() => {
    const realm = realmRef.current;
    const snitch = snitchRef.current;
    if (!realm || !snitch) return;
    let flight: gsap.core.Timeline | undefined;
    let inView = true;
    const bank = { angle: 0 };
    const updatePlayback = () => {
      if (!flight) return;
      if (inView && !document.hidden && enabled && ready) flight.resume();
      else flight.pause();
    };
    const buildFlight = () => {
      const width = realm.clientWidth;
      const height = realm.clientHeight;
      const progress = flight?.progress() || 0;
      flight?.kill();
      // The first position is deliberately clear of the title, so the snitch is always visible on arrival.
      gsap.set(snitch, { x: width * .77, y: height * .25, opacity: 1, scale: 1, rotation: -12 });
      realm.style.zIndex = "8";
      realm.dataset.depth = "front";
      if (!enabled || !ready) return;
      flight = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
      flight.to(snitch, {
        duration: 14,
        motionPath: {
          path: [
            { x: width * .77, y: height * .25 },
            { x: width * .88, y: height * .4 },
            { x: width * .66, y: height * .64 },
            { x: width * .2, y: height * .56 },
            { x: width * .12, y: height * .3 },
            { x: width * .38, y: height * .35 },
            { x: width * .63, y: height * .36 },
            { x: width * .83, y: height * .18 },
            { x: width * .77, y: height * .25 },
          ],
          curviness: 1.45,
        },
        onUpdate: () => {
          if (!flight) return;
          const phase = flight.progress();
          const behind = phase > .49 && phase < .79;
          realm.style.zIndex = behind ? "4" : "8";
          realm.dataset.depth = behind ? "behind" : "front";
          // Only the opaque glyphs occlude the snitch; the gaps between letters remain transparent.
          bank.angle = Math.sin(phase * Math.PI * 6) * 22;
          gsap.set(snitch, { rotation: bank.angle, scale: behind ? .9 : 1 });
        },
      });
      flight.progress(progress);
      updatePlayback();
    };
    const resize = new ResizeObserver(buildFlight);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updatePlayback(); });
    resize.observe(realm);
    observer.observe(realm);
    document.addEventListener("visibilitychange", updatePlayback);
    buildFlight();
    return () => {
      flight?.kill();
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, [enabled, ready]);

  return <div ref={realmRef} className="snitch-realm" data-depth="front" aria-hidden="true">
    <div className="flying-snitch" ref={snitchRef}>
      <span className="snitch-halo" /><SnitchArtwork /><span className="snitch-trail" />
    </div>
  </div>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const entered = useRef(false);
  const { enabled, ready } = useMagic();

  useEffect(() => {
    const hero = ref.current;
    if (!hero || !ready) return;
    const ctx = gsap.context(() => {
      if (!enabled) {
        gsap.set(".hero-presents, .hero-edition, .title-letter, .hero-subtitle, .hero-details, .hero-bottom", { opacity: 1, clearProps: "transform,filter" });
        return;
      }
      if (!entered.current) {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.fromTo(".hero-castle", { scale: 1.14, opacity: .45 }, { scale: 1, opacity: 1, duration: 2.4 }, 0)
          .fromTo(".hero-presents, .hero-edition", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1, stagger: .15 }, .25)
          .fromTo(".title-letter", { opacity: 0, yPercent: 110, rotationX: -70, filter: "blur(12px)" }, { opacity: 1, yPercent: 0, rotationX: 0, filter: "blur(0px)", duration: 1.25, stagger: .065, clearProps: "transform,filter" }, .38)
          .fromTo(".hero-subtitle", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1 }, 1)
          .fromTo(".hero-details", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 1.25)
          .fromTo(".hero-bottom", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .8 }, 1.55);
        entered.current = true;
      }
      const scroll = { trigger: hero, start: "top top", end: "bottom top", scrub: 1.1, invalidateOnRefresh: true };
      gsap.to(".hero-castle", { y: () => hero.clientHeight * .36, ease: "none", scrollTrigger: scroll });
      gsap.to(".hero-moon-aura", { y: () => hero.clientHeight * .16, ease: "none", scrollTrigger: scroll });
      gsap.to(".hero-mist", { y: -160, xPercent: 8, ease: "none", scrollTrigger: scroll });
      gsap.to(".floating-candles", { y: -100, ease: "none", scrollTrigger: scroll });
      gsap.to(".hero-content", { y: -75, opacity: .12, ease: "none", scrollTrigger: { ...scroll, end: "bottom 15%" } });
      ScrollTrigger.refresh();
    }, hero);
    return () => ctx.revert();
  }, [enabled, ready]);

  return <section ref={ref} className="hero" aria-labelledby="hero-title">
    <div className="hero-castle"><Image src="/images/hogwarts.webp" alt="Moonlit Hogwarts castle above the misty Black Lake, with floating golden candles" fill priority sizes="100vw" quality={75} /></div>
    <div className="hero-shade" /><div className="hero-moon-aura" aria-hidden="true" />
    <div className="castle-house-light" aria-hidden="true"/><HouseBanners/>
    <AmbientParticles count={46} />
    <div className="floating-candles" aria-hidden="true">{[9, 18, 29, 72, 83, 93].map((left, i) => <i key={left} style={{ left: `${left}%`, top: `${23 + (i * 13) % 38}%`, animationDelay: `${i * -.8}s` }}><span /></i>)}</div>
    <GoldenSnitch />
    <div className="hero-content shell">
      <div className="hero-presents"><span />BIRLA INSTITUTE OF TECHNOLOGY, PATNA PRESENTS<span /></div>
      <div className="hero-heading">
        <span className="hero-edition"><Sparkles size={12} /> The wizarding edition <Sparkles size={12} /></span>
        <h1 id="hero-title" aria-label="Technika ’27"><span aria-hidden="true">{"TECHNIKA".split("").map((letter, i) => <span className="title-letter" key={i}>{letter}</span>)}<span className="title-letter title-apostrophe">’</span><span className="title-letter title-year">2</span><span className="title-letter title-year">7</span></span></h1>
        <p className="hero-subtitle">The Triwizard Tech Odyssey</p>
      </div>
      <div className="hero-details">
        <div className="hero-date"><span /><p>08 <i>—</i> 10 JANUARY, 2027</p><span /></div>
        <p className="hero-description">Beyond the ordinary. Into the extraordinary.<br />Three days of innovation, wonder, and a little mischief.</p>
        <div className="hero-actions"><Link href="/registrations" className="button button-gold">Enter the tournament <ArrowUpRight size={17} /></Link><a href="#about" className="button button-glass">Explore the chronicles <BookOpen size={16} /></a></div>
        <span className="hero-place"><MapPin size={12} />BIT PATNA · INDIA</span>
      </div>
    </div>
    <div className="hero-mist" aria-hidden="true" />
    <div className="hero-bottom"><span className="hero-volume">VOL. XVII <i>✦</i> A NEW CHAPTER</span><a href="#timeline" className="scroll-cue"><span>Unfold the magic</span><ArrowDown size={15} /></a><span className="hero-side-note">NOT ALL MAGIC IS FICTION.</span></div>
  </section>;
}
