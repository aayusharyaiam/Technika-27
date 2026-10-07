"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, BookOpen, MapPin, Sparkles } from "lucide-react";
import { AmbientParticles, SnitchArtwork } from "./ornaments";
import { useMagic } from "./experience";

function GoldenSnitch() {
  const realmRef = useRef<HTMLDivElement>(null);
  const snitchRef = useRef<HTMLDivElement>(null);
  const { enabled } = useMagic();

  useEffect(() => {
    const realm = realmRef.current;
    const snitch = snitchRef.current;
    if (!realm || !snitch) return;
    let width = realm.clientWidth;
    let height = realm.clientHeight;
    let visible = true;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    const resize = new ResizeObserver(() => { width = realm.clientWidth; height = realm.clientHeight; });
    resize.observe(realm);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(realm);
    if (!enabled) {
      snitch.style.transform = `translate3d(${width * .82}px, ${height * .32}px, 0) rotate(-12deg)`;
      return () => { resize.disconnect(); observer.disconnect(); };
    }
    const fly = (time: number) => {
      const delta = previous ? Math.min((time - previous) / 1000, .04) : 0;
      previous = time;
      if (visible && !document.hidden) {
        elapsed += delta;
        const t = elapsed * .37;
        const x = width * (.5 + Math.sin(t) * .37) + Math.sin(t * 3.2) * 12;
        const y = height * (.43 + Math.sin(t * 2) * .21) + Math.cos(t * 2.8) * 15;
        const bank = Math.sin(t * 2 + .8) * 25;
        // A real depth change: opaque title glyphs occlude the snitch as it dives behind them.
        realm.style.zIndex = Math.cos(t) > -.15 ? "4" : "8";
        snitch.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${bank}deg) scale(${Math.cos(t) > -.15 ? .86 : 1})`;
      }
      frame = requestAnimationFrame(fly);
    };
    frame = requestAnimationFrame(fly);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); };
  }, [enabled]);

  return <div ref={realmRef} className="snitch-realm" aria-hidden="true"><div className="flying-snitch" ref={snitchRef}><span className="snitch-halo" /><SnitchArtwork /><span className="snitch-trail" /></div></div>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { enabled, ready } = useMagic();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const castleY = useTransform(scrollYProgress, [0, 1], [0, 210]);
  const mistY = useTransform(scrollYProgress, [0, 1], [0, -85]);

  return <section ref={ref} className="hero" aria-labelledby="hero-title">
    <motion.div className="hero-castle" style={{ y: enabled ? castleY : 0 }}><Image src="/images/hogwarts.webp" alt="Moonlit Hogwarts castle above the misty Black Lake, with floating golden candles" fill priority sizes="100vw" quality={90} /></motion.div>
    <div className="hero-shade" />
    <AmbientParticles count={34} />
    <div className="floating-candles" aria-hidden="true">{[9, 18, 29, 72, 83, 93].map((left, i) => <i key={left} style={{ left: `${left}%`, top: `${23 + (i * 13) % 38}%`, animationDelay: `${i * -.8}s` }}><span /></i>)}</div>
    <GoldenSnitch />
    <div className="hero-content shell">
      <motion.div className="hero-presents" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: .05, duration: .8 }}><span />BIRLA INSTITUTE OF TECHNOLOGY, PATNA PRESENTS<span /></motion.div>
      <motion.div className="hero-heading" initial={{ opacity: 0, y: 25 }} animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 25 }} transition={{ delay: .15, duration: .9 }}>
        <span className="hero-edition"><Sparkles size={12} /> The wizarding edition <Sparkles size={12} /></span>
        <h1 id="hero-title">TECHNIKA<span className="title-apostrophe">’</span><span className="title-year">27</span></h1>
        <p className="hero-subtitle">The Triwizard Tech Odyssey</p>
      </motion.div>
      <motion.div className="hero-details" initial={{ opacity: 0, y: 18 }} animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 18 }} transition={{ delay: .3, duration: .8 }}>
        <div className="hero-date"><span /><p>08 <i>—</i> 10 JANUARY, 2027</p><span /></div>
        <p className="hero-description">Beyond the ordinary. Into the extraordinary.<br />Three days of innovation, wonder, and a little mischief.</p>
        <div className="hero-actions"><Link href="/registrations" className="button button-gold">Enter the tournament <ArrowUpRight size={17} /></Link><a href="#about" className="button button-glass">Explore the chronicles <BookOpen size={16} /></a></div>
        <span className="hero-place"><MapPin size={12} />BIT PATNA · INDIA</span>
      </motion.div>
    </div>
    <motion.div className="hero-mist" style={{ y: enabled ? mistY : 0 }} aria-hidden="true" />
    <div className="hero-bottom"><span className="hero-volume">VOL. XVII <i>✦</i> A NEW CHAPTER</span><a href="#timeline" className="scroll-cue"><span>Unfold the magic</span><ArrowDown size={15} /></a><span className="hero-side-note">NOT ALL MAGIC IS FICTION.</span></div>
  </section>;
}
